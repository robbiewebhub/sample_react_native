import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import DeleteFeedModal from '../../../components/deleteFeedModal';
import PostCard from '../../../components/postCard';
import Progressbar from '../../../components/progressbar';
import { COLORS, FONTS, IMAGES, SCREEN_WIDTH } from '../../../constant';
import {
  imageBaseUrl,
  useDeleteFeedMutation,
  useGetAllFeedQuery,
  useUnVotePollMutation,
  useVotePollMutation,
} from '../../../services/api';
import { showSuccess } from '../../../utils/flashMessageUtils';
import { navigate } from '../../../utils/navigations';

const filterList = [
  {id: 1, label: 'All'},
  {id: 2, label: 'Chef Stories'},
  {id: 3, label: 'Eat w/ Chef'},
  {id: 4, label: 'TikTok Feed'},
  {id: 5, label: 'Hot Topics'},
];

const {width} = Dimensions.get('screen');

const formatDate = dateString => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en', {month: 'short'});
  return {day, month};
};

// Helper function to check if poll is expired
const isPollExpired = expiresAt => {
  return new Date() > new Date(expiresAt);
};

// Helper function to calculate time remaining
const getTimeRemaining = expiresAt => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry - now;

  if (diffMs <= 0) return 'Ended';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `Ends in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Ends in ${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Ends soon';
};

const VoteCard = ({
  pollData,
  isVotingPoll,
  handleVoting,
  handleUnVoting,
  pollId,
}) => {
  const expired = isPollExpired(pollData.expires_at);
  const timeRemaining = getTimeRemaining(pollData.expires_at);

  const [selectedOptions, setSelectedOptions] = useState(
    pollData?.voted_options || [],
  );
  const [loadingOption, setLoadingOption] = useState(null);

  const userHasVoted = pollData?.voted_options?.length > 0;

  const handleOptionSelect = async idx => {
    if (isVotingPoll || loadingOption !== null) return;
    if (expired) return;

    setLoadingOption(idx);

    try {
      if (!pollData?.allow_multiple) {
        if (userHasVoted) return;
        await handleVoting?.(pollId, false, idx);
        setSelectedOptions([idx]);
        return;
      }

      if (pollData?.allow_multiple) {
        const isCurrentlySelected = selectedOptions.includes(idx);
        if (isCurrentlySelected) {
          await handleUnVoting?.(pollId, idx);
        } else {
          await handleVoting?.(pollId, false, idx);
        }

        setSelectedOptions(prev =>
          isCurrentlySelected ? prev.filter(i => i !== idx) : [...prev, idx],
        );
      }
    } catch (error) {
      console.error('Voting action failed:', error);
    } finally {
      setLoadingOption(null);
    }
  };

  useEffect(() => {
    setSelectedOptions(pollData?.voted_options || []);
  }, [pollData?.voted_options]);

  return (
    <View>
      <View style={{paddingBottom: 16}}>
        <Text style={styles.heading}>{pollData.question}</Text>
        {pollData?.allow_multiple && (
          <Text style={styles.voteText}>Select one or more</Text>
        )}
      </View>

      <View style={{gap: 16}}>
        {pollData.options.map((option, idx) => (
          <Progressbar
            key={idx}
            title={option.text}
            onPress={() => handleOptionSelect(idx)}
            isVotingPoll={loadingOption === idx}
            value={`${option?.percentage || 0}%`}
            pollData={pollData}
            allowMultiple={pollData?.allow_multiple}
            userHasVoted={userHasVoted}
            isSelected={selectedOptions.includes(idx)}
          />
        ))}
      </View>

      <View style={{flexDirection: 'row', paddingTop: 8}}>
        <Text style={styles.voteText}>
          {pollData?.total_votes || 0} people have voted ·
        </Text>
        <Text style={styles.voteText}>{timeRemaining}</Text>
      </View>
    </View>
  );
};

const JoinCard = ({eventData}) => {
  const dateInfo = formatDate(eventData.start_at);
  const startTime = new Date(eventData.start_at).toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const endTime = new Date(eventData.end_at).toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <View style={styles.joinCard}>
      <View style={styles.joinCardImg}>
        <View style={styles.date}>
          <Text style={styles.dateNum}>{dateInfo.day}</Text>
          <Text style={styles.dateMonth}>{dateInfo.month}</Text>
        </View>
        {eventData.cover ? (
          // <Image
          //   source={{uri: `${imageBaseUrl}${eventData.cover}`}}
          //   style={{width: '100%', height: 200}}
          // />
          <FastImage
            source={{
              uri: `${imageBaseUrl}${eventData.cover}`,
              priority: FastImage.priority.high,
            }}
            style={{width: "100%", height: 200}}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image source={IMAGES.joinImg} style={{width: '100%', height: 200}} />
        )}
      </View>
      <View style={styles.joinCardText}>
        <View style={{flex: 1, gap: 4}}>
          <Text style={styles.joinCardTtl}>{eventData.name}</Text>
          <Text style={styles.joinCardLabel}>
            {startTime} - {endTime}
          </Text>
          <Text style={styles.joinCardLabel}>
            {eventData.attendees_count || 0}/
            {eventData.max_guests || 'unlimited'} have joined
          </Text>
          <Text style={styles.joinCardLabel}>{eventData.location}</Text>
          <Text style={styles.joinCardLabel}>
            Price: {eventData?.is_free ? 'Free' : `$${eventData?.price}`}
          </Text>
        </View>
        {/* <ButtonBox
          label={eventData.is_free ? 'Join Free' : 'Join'}
          onPress={() => navigate('JoinEventScreen', {eventData})}
        /> */}
      </View>
    </View>
  );
};

const Post = ({postData}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };
  return (
    <View>
      {postData.body && (
        <View style={{paddingBottom: 8}}>
          <Text style={styles.text}>{postData.body}</Text>
        </View>
      )}
      {postData.images && postData.images.length > 0 && (
        <View style={{marginLeft: -16, marginRight: -16}}>
          {postData.images.length === 1 ? (
            // <Image
            //   source={{uri: `${imageBaseUrl}${postData.images[0]}`}}
            //   style={{width: width, height: 320}}
            //   resizeMode="cover"
            // />
            <FastImage
              source={{
                uri: `${imageBaseUrl}${postData.images[0]}`,
                priority: FastImage.priority.high,
              }}
              style={{width: width, height: 320}}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View>
              <FlatList
                horizontal
                data={postData.images}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                pagingEnabled
                renderItem={({item, index}) => (
                  // <Image
                  //   source={{uri: `${imageBaseUrl}${item}`}}
                  //   style={{width: width, height: 320}}
                  //   resizeMode="cover"
                  // />
                  <FastImage
                    source={{
                      uri: `${imageBaseUrl}${item}`,
                      priority: FastImage.priority.high,
                    }}
                    style={{width: width, height: 320}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                )}
              />

              <View style={styles.counterWrapper}>
                <Text style={styles.counterText}>
                  {activeIndex + 1}/{postData.images?.length}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const getFilteredData = (data, filter) => {
  if (!data || !Array.isArray(data)) return [];

  switch (filter) {
    case 'All':
      return data;
    case 'Chef Stories':
      return data.filter(item => item?.type === 'post');
    case 'Eat w/ Chef':
      return data.filter(item => item?.type === 'event');
    case 'Hot Topics':
      return data.filter(item => item?.type === 'poll');
    case 'TikTok Feed':
      return data.filter(
        item => item?.type === 'post' && item?.data?.images?.length > 0,
      );
    default:
      return data || [];
  }
};

const FeedTab = ({kitcheProfileData, userProfilePic}) => {
  const [isFilter, setIsFilter] = useState('All');
  const [votePoll, {isLoading: isVotingPoll}] = useVotePollMutation();
  const [unVotePoll, {isLoading: isUnVotingPoll}] = useUnVotePollMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const [deleteFeed, {isLoading: isDeletingFeed}] = useDeleteFeedMutation();

  const [cursor, setCursor] = useState('');
  const [feeds, setFeeds] = useState([]);

  const {
    data: allFeedData,
    isFetching: isFetchingFeedData,
    refetch,
  } = useGetAllFeedQuery({kitchenId: kitcheProfileData?.id, cursor});

  useEffect(() => {
    if (allFeedData?.data) {
      if (cursor === '') {
        setFeeds(allFeedData.data);
      } else {
        setFeeds(prevFeeds => [...prevFeeds, ...allFeedData.data]);
      }
    }
  }, [allFeedData]);

  const filteredData = useMemo(() => {
    return getFilteredData(feeds, isFilter) || [];
  }, [feeds, isFilter]);

  const onFilter = value => {
    setIsFilter(value);
  };

  const refreshFeed = () => {
    setCursor('');
    refetch();
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {
        console.log('Chef Account Screen feeds are unfocused');
      };
    }, [refetch]),
  );
  

  const handleVoting = async (pollId, allow_multiple, selectedIndices) => {
    const payload = {
      option_order: allow_multiple ? selectedIndices : selectedIndices,
    };
    try {
      const result = await votePoll({
        id: pollId,
        data: payload,
      }).unwrap();
      if (result?.success) {
        refreshFeed();
      }
    } catch (error) {
      console.log('Error in voting poll', error);
    }
  };

  const handleUnVoting = async (pollId, selectedIndices) => {
    const payload = {
      option_order: selectedIndices,
    };
    try {
      const result = await unVotePoll({
        id: pollId,
        data: payload,
      }).unwrap();
      if (result?.success) {
        refreshFeed();
      }
    } catch (error) {
      console.log('Error in un-voting poll', error);
    }
  };

  const handleLikeUpdate = (postId, postType, isLiked, newLikesCount) => {
    setFeeds(currentFeeds =>
      currentFeeds.map(item => {
        if (item.id === postId && item.type === postType) {
          return {
            ...item,
            data: {
              ...item.data,
              likes_count: newLikesCount,
              liked_by_me: isLiked,
            },
          };
        }
        return item;
      }),
    );
  };

  const handleCommentUpdate = (postId, postType, newCommentsCount) => {
    setFeeds(currentFeeds =>
      currentFeeds.map(item => {
        if (item.id === postId && item.type === postType) {
          return {
            ...item,
            data: {
              ...item.data,
              comments_count: newCommentsCount,
            },
          };
        }
        return item;
      }),
    );
  };

  const renderFeedItem = (item, index) => {
    const actionList = [
      {
        label: 'Edit',
        action: () => {
          if (item?.type === 'post') {
            navigate('ManagePost', {
              postData: item?.data,
              isEdit: true,
              postId: item?.id,
            });
          } else if (item?.type === 'event') {
            navigate('ManageEvent', {
              eventData: item?.data,
              isEdit: true,
              eventId: item?.id,
            });
          } else if (item?.type === 'poll') {
            navigate('NewPollScreen', {
              pollData: item?.data,
              isEdit: true,
              pollId: item?.id,
            });
          }
        },
      },
      {
        label: 'Delete',
        action: () => handleDeleteFeed(item?.id, item?.type),
      },
    ];

    const uniqueKey = `${item.type}-${item.id}-${index}`;

    const postCardProps = {
      editable: true,
      actionList,
      postId: item.id,
      postType: item.type,
      initialLikes: item.data?.likes_count || 0,
      initialComments: item.data?.comments_count || 0,
      isLiked: item.data?.liked_by_me || false,
      onLikeUpdate: handleLikeUpdate,
      onCommentUpdate: handleCommentUpdate,
      kitcheProfileData: kitcheProfileData,
      userProfilePic: userProfilePic,
    };

    switch (item.type) {
      case 'poll':
        return (
          <PostCard key={uniqueKey} {...postCardProps}>
            <VoteCard
              pollData={item.data}
              handleVoting={handleVoting}
              handleUnVoting={handleUnVoting}
              isVotingPoll={isVotingPoll}
              pollId={item?.id}
            />
          </PostCard>
        );

      case 'event':
        return (
          <PostCard key={uniqueKey} {...postCardProps}>
            <JoinCard eventData={item.data} />
          </PostCard>
        );

      case 'post':
        return (
          <PostCard key={uniqueKey} {...postCardProps}>
            <Post postData={item.data} />
          </PostCard>
        );

      default:
        return null;
    }
  };

  const handleDeleteFeed = (postId, postType) => {
    setPendingDelete({postId, postType});
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    const {postId, postType} = pendingDelete;

    try {
      setShowDeleteModal(false);
      const result = await deleteFeed({id: postId, type: postType}).unwrap();

      if (result?.success) {
        showSuccess(result?.message || 'Post deleted successfully');
        setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== postId));
      } else {
        showError('Failed to delete post');
      }
    } catch (error) {
      console.log('Delete failed', error);
      showError('An error occurred while deleting the post');
    } finally {
      setPendingDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDelete(null);
  };

  const handleEndReached = () => {
    if (
      !isFetchingFeedData &&
      allFeedData?.hasMore &&
      allFeedData?.nextCursor
    ) {

      console.log("handleEndReached called")
      setCursor(allFeedData.nextCursor);
    }
  };

  const renderFooter = () => {
    if (!isFetchingFeedData || cursor === '') return null;
    return (
      <View style={{padding: 16, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={COLORS.neutral[600]} />
      </View>
    );
  };

  if (isFetchingFeedData && cursor === '') {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={COLORS.neutral[800]} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        data={filterList}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        style={{marginBottom: 24}}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.filterBtn,
              isFilter === item.label ? styles.activeTab : null,
            ]}
            onPress={() => onFilter(item.label)}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color:
                    isFilter === item.label
                      ? COLORS.common.white
                      : COLORS.neutral[400],
                },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isFilter === 'TikTok Feed' ? (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
          {filteredData?.map((item, idx) => (
            <TouchableOpacity
              key={`tiktok-${item.id}-${idx}`}
              style={{width: width / 2 - 20}}>
              <Image
                source={{
                  uri:
                    `${imageBaseUrl}${item.data.images?.[0]}` ||
                    IMAGES.tiktokImg1,
                }}
                style={{width: '100%', borderRadius: 8, height: 310}}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => renderFeedItem(item, index)}
          keyExtractor={(item, index) => `${item?.id}-${item?.type}-${index}`}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

      {feeds.length > 0 && filteredData?.length === 0 && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
          }}>
          <Text style={styles.voteText}>
            No content available for this filter
          </Text>
        </View>
      )}
      
      {!isFetchingFeedData && feeds.length === 0 && (
         <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
          }}>
          <Text style={styles.voteText}>
            There are no posts in this feed yet.
          </Text>
        </View>
      )}


      <DeleteFeedModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 30,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeTab: {
    borderColor: COLORS.neutral[800],
    backgroundColor: COLORS.neutral[800],
  },
  filterBtnText: {
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  heading: {
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  text: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  voteText: {
    color: COLORS.neutral[400],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  link: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.neutral['black'],
    gap: 4,
    flexDirection: 'row',
  },
  linkText: {
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  joinCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    overflow: 'hidden',
    gap: 8,
  },
  joinCardImg: {
    position: 'relative',
  },
  date: {
    backgroundColor: COLORS.common.white,
    borderRadius: 4,
    width: 52,
    height: 56,
    top: 16,
    left: 16,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  dateNum: {
    color: COLORS.neutral[600],
    fontSize: 28,
    fontFamily: FONTS.poppins[600],
    textAlign: 'center',
    marginBottom: -6,
  },
  dateMonth: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[500],
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  joinCardText: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  joinCardTtl: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 16,
  },
  joinCardLabel: {
    color: COLORS.neutral[500],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  counterWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    opacity: 0.9,
    zIndex: 1,
  },
  counterText: {
    color: COLORS.common.white,
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
});

export default FeedTab;
