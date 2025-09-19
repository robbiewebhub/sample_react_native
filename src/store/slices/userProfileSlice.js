import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userProfileData: {
    id: null,
    email: '',
    fullName: '',
    phone: '',
    profilePic: '',
    password: '',
    role: '',
    status: '',
    lastLogin: '',
    refreshToken: null,
    refreshTokenExpiresAt: '',
    otp: null,
    otpExpiresAt: null,
    otpCreatedAt: null,
    resetToken: null,
    resetTokenExpiresAt: null,
    createdAt: '',
    updatedAt: '',
  },
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserProfileData: (state, action) => {
      state.userProfileData = action.payload;
    },
    clearUserProfileData: state => {
      state.userProfileData = null;
    },
    updateProfilePicUrl: (state, action) => {
      state.userProfileData.profilePic = action.payload;
    },
  },
});

export const {setUserProfileData, clearUserProfileData, updateProfilePicUrl} =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
