import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {clearUser, setUser} from '../store/slices/userSlice';

const baseUrl = '';
export const imageBaseUrl = '';


const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  timeout: 600000,
  prepareHeaders: (headers, {getState}) => {
    const state = getState();
    const accessToken = state.user?.user?.accessToken;
    const refreshToken = state.user?.user?.refreshToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

let isRefreshing = false;
let requestQueue = [];

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState();
    const refreshToken = state.user?.user?.refreshToken;

    if (typeof args === 'object' && args?.url === '/auth/refresh-tokens') {
      api.dispatch(clearUser());
      return result;
    }

    if (!refreshToken) {
      api.dispatch(clearUser());
      return result;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({args, api, extraOptions, resolve, reject});
      });
    }

    isRefreshing = true;

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-tokens',
        method: 'POST',
        body: {refreshToken},
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const {accessToken: newAT, refreshToken: newRT} = refreshResult.data.data;
      api.dispatch(setUser({accessToken: newAT, refreshToken: newRT}));

      await new Promise(r => setTimeout(r, 0));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);

      // Retry all queued requests
      requestQueue.forEach(async queued => {
        const retriedResult = await baseQuery(
          queued.args,
          queued.api,
          queued.extraOptions,
        );
        queued.resolve(retriedResult);
      });
    } else {
      api.dispatch(clearUser());

      requestQueue.forEach(queued => {
        queued.reject({error: 'Token refresh failed'});
      });
    }

    requestQueue = [];
    isRefreshing = false;
  }

  return result;
};

const baseQueryWithLogging = async (args, api, extraOptions) => {
  // Log the full request details
  console.log('📤 RTK Query Request:', {
    endpoint: api.endpoint,
    type: api.type,
    url: typeof args === 'string' ? args : args.url,
    method: typeof args === 'object' ? args.method : 'GET',
    body: typeof args === 'object' ? args.body : null,
    params: typeof args === 'object' ? args.params : null,
    headers: typeof args === 'object' ? args.headers : null,
    timestamp: new Date().toISOString(),
    fullArgs: args,
  });

  // Make the actual request
  const result = await baseQueryWithReauth(args, api, extraOptions);

  // Log the response
  if (result.error) {
    console.log('❌ RTK Query Error Response:', {
      endpoint: api.endpoint,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.log('✅ RTK Query Success Response:', {
      endpoint: api.endpoint,
      data: result.data,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging,
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: data => ({
        url: '/auth/create-account',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: data => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resentOtp: builder.mutation({
      query: data => ({
        url: '/auth/resend-forgot-otp',
        method: 'POST',
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: data => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: data => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: data => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
    }),

    changePassword: builder.mutation({
      query: data => ({
        url: '/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    updateProfile: builder.mutation({
      query: data => ({
        url: '/users/update-profile',
        method: 'PATCH',
        body: data,
      }),
    }),

    updateProfilePic: builder.mutation({
      query: formData => ({
        url: '/users/profile-pic',
        method: 'PUT',
        body: formData,
      }),
    }),

    deleteAccount: builder.mutation({
      query: data => ({
        url: '/users/delete-account',
        method: 'DELETE',
        body: data,
      }),
    }),

    getAllAds: builder.query({
      query: () => ({
        url: 'users/getAds',
        method: 'GET',
      }),
    }),

    getCategory: builder.query({
      query: () => ({
        url: 'users/category',
        method: 'GET',
      }),
    }),

    getAllKitchen: builder.query({
      query: () => ({
        url: '/users/kitchen',
        method: 'GET',
      }),
    }),

    createKitchen: builder.mutation({
      query: formData => ({
        url: '/users/kitchen',
        method: 'POST',
        body: formData,
      }),
    }),

    updateKitchen: builder.mutation({
      query: ({id, data}) => ({
        url: `/users/kitchen/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    updateKitchenImage: builder.mutation({
      query: ({id, data}) => ({
        url: `/users/kitchen/update-cover/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    getMyKitchen: builder.query({
      query: () => ({
        url: '/users/kitchen/my-kitchen',
        method: 'GET',
      }),
    }),

    createMenu: builder.mutation({
      query: formData => ({
        url: '/users/kitchen/menu',
        method: 'POST',
        body: formData,
      }),
    }),

    updateMenu: builder.mutation({
      query: ({id, formData}) => ({
        url: `/users/kitchen/menu/${id}`,
        method: 'PATCH',
        body: formData,
      }),
    }),

    updateMenuImages: builder.mutation({
      query: ({id, formData}) => ({
        url: `/users/kitchen/menu/update-cover/${id}`,
        method: 'POST',
        body: formData,
      }),
    }),

    updateMenuData: builder.mutation({
      query: ({id, formData}) => ({
        url: `/users/kitchen/menu/update-menu/${id}`,
        method: 'POST',
        body: formData,
      }),
    }),

    getUserMenu: builder.query({
      query: () => ({
        url: '/users/kitchen/menu/all-user-menu',
        method: 'GET',
      }),
    }),

    toggleMenuEnabled: builder.mutation({
      query: ({id, is_menu_enabled}) => ({
        url: `/users/kitchen/menu/available/${id}`,
        method: 'PATCH',
        body: {status: is_menu_enabled},
      }),
    }),

    updateMenuServing: builder.mutation({
      query: ({id, serving}) => ({
        url: `/users/kitchen/menu/serve/${id}`,
        method: 'PATCH',
        body: {quantity: parseInt(serving)},
      }),
    }),

    getTermsOfService: builder.query({
      query: () => ({
        url: '/users/page/terms',
        method: 'GET',
      }),
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: '/users/page/privacy',
        method: 'GET',
      }),
    }),

    createPost: builder.mutation({
      query: formData => ({
        url: '/users/kitchen/post/create',
        method: 'POST',
        body: formData,
      }),
    }),

    updatePost: builder.mutation({
      query: ({id, formData}) => ({
        url: `/users/kitchen/post/${id}`,
        method: 'PATCH',
        body: formData,
      }),
    }),

    createEvent: builder.mutation({
      query: formData => ({
        url: '/users/kitchen/event/create',
        method: 'POST',
        body: formData,
      }),
    }),

    updateEvent: builder.mutation({
      query: ({id, formData}) => ({
        url: `/users/kitchen/event/update/${id}`,
        method: 'PATCH',
        body: formData,
      }),
    }),

    joinEvent: builder.mutation({
      query: ({id, data}) => ({
        url: `/users/kitchen/event/join/${id}`,
        method: 'POST',
        body: data,
      }),
    }),

    createPoll: builder.mutation({
      query: data => ({
        url: '/users/kitchen/poll/create',
        method: 'POST',
        body: data,
      }),
    }),

    updatePoll: builder.mutation({
      query: ({id, data}) => ({
        url: `users/kitchen/poll/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    votePoll: builder.mutation({
      query: ({id, data}) => ({
        url: `/users/kitchen/poll/vote/${id}`,
        method: 'POST',
        body: data,
      }),
    }),

    unVotePoll: builder.mutation({
      query: ({id, data}) => ({
        url: `/users/kitchen/poll/un-vote/${id}`,
        method: 'POST',
        body: data,
      }),
    }),

    getAllFeed: builder.query({
      query: ({kitchenId, cursor = ''}) => ({
        url: `/users/kitchen/feed/${kitchenId}?cursor=${cursor}&limit=10`,
        method: 'GET',
      }),
    }),

    deleteFeed: builder.mutation({
      query: ({id, type}) => ({
        url: `/users/kitchen/${type}/${id}`,
        method: 'DELETE',
      }),
    }),

    likeFeed: builder.mutation({
      query: ({id, type}) => ({
        url: `/users/kitchen/${type}/like/${id}`,
        method: 'POST',
      }),
    }),

    commentFeed: builder.mutation({
      query: ({id, postType, data}) => ({
        url: `/users/kitchen/${postType}/comment/${id}`,
        method: 'POST',
        body: data,
      }),
    }),

    getFeedComment: builder.query({
      query: ({id, type}) => ({
        url: `/users/kitchen/${type}/comment/${id}`,
        method: 'GET',
      }),
    }),

    registerChef: builder.mutation({
      query: () => ({
        url: '/users/chef/register',
        method: 'POST',
      }),
    }),

    getFeaturedKitchen: builder.query({
      query: page => ({
        url: `/users/kitchen/featured?page=${page}&limit=10`,
        method: 'GET',
      }),
    }),

    getRecentlyViewedKitchen: builder.query({
      query: () => ({
        url: `/users/kitchen/recently-view`,
        method: 'GET',
      }),
    }),

    trackRecentKitchen: builder.mutation({
      query: ({id}) => ({
        url: `/users/kitchen/view/${id}`,
        method: 'POST',
      }),
    }),

    getKitchenMenu: builder.query({
      query: kitchenId => ({
        url: `/users/kitchen/menu/kitchen-menu/${kitchenId}`,
        method: 'GET',
      }),
    }),

    followKitchen: builder.mutation({
      query: ({id}) => ({
        url: `/users/kitchen/follow/${id}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResentOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
  useDeleteAccountMutation,
  useGetAllAdsQuery,
  useGetCategoryQuery,
  useGetAllKitchenQuery,
  useCreateKitchenMutation,
  useUpdateKitchenMutation,
  useUpdateKitchenImageMutation,
  useGetMyKitchenQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useUpdateMenuImagesMutation,
  useUpdateMenuDataMutation,
  useGetUserMenuQuery,
  useToggleMenuEnabledMutation,
  useUpdateMenuServingMutation,
  useGetTermsOfServiceQuery,
  useGetPrivacyPolicyQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useJoinEventMutation,
  useCreatePollMutation,
  useUpdatePollMutation,
  useVotePollMutation,
  useUnVotePollMutation,
  useGetAllFeedQuery,
  useDeleteFeedMutation,
  useLikeFeedMutation,
  useCommentFeedMutation,
  useGetFeedCommentQuery,
  useRegisterChefMutation,
  useGetFeaturedKitchenQuery,
  useGetRecentlyViewedKitchenQuery,
  useTrackRecentKitchenMutation,
  useGetKitchenMenuQuery,
  useFollowKitchenMutation,
  useLazyGetAllFeedQuery,
} = api;
