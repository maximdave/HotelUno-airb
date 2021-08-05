/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, ChangeEvent, MouseEvent,
} from 'react';
import axios from 'axios';
import { withRouter, useHistory } from 'react-router-dom';

const initialData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  type: '',
  favorites: [''],
};

export interface RoomData {
    hostid: string;
    hostname: string;
    price: string;
    description: string;
    location: string;
    title: string;
    roomId: string;
    features: string;
    booked: boolean,
    imageUrl: string[]
}

const AuthContext = React.createContext({
  loading: false,
  handleEmailInputChange: (_e: ChangeEvent<HTMLInputElement>) => { },
  handlePasswordInputChange: (_e: ChangeEvent<HTMLInputElement>) => { },
  handlePasswordConfirmationChange: (_e: ChangeEvent<HTMLInputElement>) => { },
  handleFirstNameInput: (_e: ChangeEvent<HTMLInputElement>) => { },
  handleLastNameInput: (_e: ChangeEvent<HTMLInputElement>) => { },
  handlePhoneInput: (_e: ChangeEvent<HTMLInputElement>) => { },
  handleSelect: (_e: ChangeEvent<HTMLSelectElement>) => { },
  handleLoginSubmit: (_e: MouseEvent<HTMLButtonElement>) => { },
  handleSignupSubmit: (_e: MouseEvent<HTMLButtonElement>) => { },
  logout: () => { },
  loginType: 'guest',
  data: initialData,
  passwordConfirmation: '',
  isSignup: false,
  show: false,
  userType: 'guest',
  toggleModal: () => { },
  guestSignUp: () => { },
  hostSignUp: () => { },
  signIn: () => { },
  fetchRoomsData: () => { },
  userData: initialData,
  roomsData: [{
    hostid: '',
    hostname: '',
    price: '',
    description: '',
    location: '',
    title: '',
    roomId: '',
    features: '',
    booked: false,
    imageUrl: [''],
  }],
  searchResults: [{
    hostid: '',
    hostname: '',
    price: '',
    description: '',
    location: '',
    title: '',
    features: '',
    booked: false,
    imageUrl: [''],
  }],
  handleSearchResults: (_e: ChangeEvent<HTMLInputElement>) => { },
  showResults: false,
  route: '',
  loggedIn: false,
  roomShown: {
    hostid: '',
    hostname: '',
    price: '',
    description: '',
    location: '',
    title: '',
    roomId: '',
    features: '',
    booked: false,
    imageUrl: [''],
  },
  handleRoomClick: (_data: any) => { },
  formError: '',
  handleFavorites: (_data: any) => { },
  favorites: [''],
  updateUser: (_a: any, _b: any, _c: any) => { },
  submitBooking: (_data: any) => '' as any,
  guestBecomeHost: () => '' as any,

});

const AuthContextComp = (props: any) => {
  const history = useHistory();
  const [userData, setUserData] = useState(initialData);
  const [allUsers, setAllUsers] = useState([initialData]);
  const [roomShown, setRoomShown] = useState({} as RoomData);
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loginType, setLoginType] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [searchResults, setSearchResults] = useState<RoomData[]>([]);
  const [isSignup, setSignup] = useState(false);
  const [userType, setUserType] = useState('guest');
  const [showResults, setShowResults] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState(initialData);
  const [formError, setFormError] = useState('');
  const [favorites, setFavorites] = useState([] as string[]);

  useEffect(() => {
    setUserData(initialData);
    setFormError('');
  }, [show]);

  // Fetch all data on page load
  const fetchRoomsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://fierce-plains-40745.herokuapp.com/api/rooms');
      const { data } = await res;
      setRoomsData(data);
      console.log('roomsData', roomsData, 'data', data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  // Make guest user a host once he clicks on Become a Host
  const guestBecomeHost = async () => {
    const res = await updateUser(loggedInUserData.email, 'guest', { type: 'host' });
    const updUser = {
      ...loggedInUserData, type: 'host',
    };
    localStorage.setItem('user', JSON.stringify(updUser));
    return res.status;
  };

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://fierce-plains-40745.herokuapp.com/api/allGuests');
      const { data } = await res;
      setAllUsers(data);
      return data;
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
    // Fetch rooms and users once page loads
  useEffect(() => {
    fetchRoomsData();
    fetchUsersData();
  }, []);

  // Check local storage for a previously logged in user
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      const updatedUser = allUsers.find((user) => user.email === foundUser.email && user.type === foundUser.type);
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setLoggedInUserData(updatedUser);
        setFavorites(updatedUser.favorites);
        setLoggedIn(true);
      }
    }
  }, [allUsers, favorites]);

  // Search through all available rooms
  const handleSearchResults = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '') setShowResults(false);
    else {
      setShowResults(true);
      const results = roomsData.filter((item) => item.location && item.location.toLowerCase().indexOf(value.toLowerCase()) !== -1);
      setSearchResults(results);
    }
  };

  const submitBooking = async (data: { roomId: any; }) => {
    if (!loggedIn) {
      setShow(true);
      return { message: 'You have to be logged in' };
    }

    setLoading(true);
    const res = await axios.post('https://fierce-plains-40745.herokuapp.com/api/bookings', data);
    if (res.data.status === 'Successful') {
      await updateRoom({ booked: true }, data.roomId);
    }
    console.log(res.data);
    setLoading(false);
    return res.data;
  };

  const updateRoom = async (body: { booked: boolean; }, id: any) => {
    try {
      const { data } = await axios.put(`https://fierce-plains-40745.herokuapp.com/api/updateRoom/${id}`, body);
      return data;
    } catch ({ message }) {
      return message;
    }
  };

  // Display a clicked room
  const handleRoomClick = (title: string) => {
    // This should later be handled with a unique room id
    const room = roomsData.find((room) => room.title === title);
    if (room) {
      setRoomShown(room);
      props.history.push(`/room/${room.roomId}`);
      setShowResults(false);
    }
  };

  // Add or remove a room from list of favorites
  const handleFavorites = (id: string) => {
    if (!loggedIn) {
      return alert('You have to be logged in');
    }
    const currFavorites = favorites;
    if (currFavorites.includes(id)) {
      // Remove room from favorites if it was already there
      currFavorites.splice(currFavorites.indexOf(id), 1);
    } else {
      // Otherwise add it
      currFavorites.push(id);
    }
    setFavorites(currFavorites);
    const body = { favorites: currFavorites };
    updateUser(loggedInUserData.email, 'guest', body);
  };

  // Update user info in the database
  const updateUser = async (id: string, type: string, data: { type?: string; favorites?: string[]; }) => {
    try {
      const res = await axios.put(`https://fierce-plains-40745.herokuapp.com/api/user/${id}?type=${type}`, data);
      return res.data;
    } catch ({ message }) {
      console.log(message);
    }
  };

  // Validate user credentials
  const status = (validationType: string) => {
    switch (validationType) {
      case 'email':
        const testRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!testRegex.test(userData.email)) {
          return 'Invalid email address';
        }

        return '';

      case 'password':
        const numReg = /[0-9]/g;
        if (!(userData.password.trim().length > 7 && numReg.test(userData.password))) {
          return 'passwords must be greater than 7 and should contain numbers and alphabets';
        }
        if (passwordConfirmation !== userData.password) {
          return 'passwords do not match';
        }
        return '';
      default:
        return true;
    }
  };

  const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, email: e.target.value });
  };
  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, password: e.target.value });
  };

  const handlePasswordConfirmationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleFirstNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, firstName: e.target.value });
  };
  const handleLastNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, lastName: e.target.value });
  };
  const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, phone: e.target.value });
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setLoginType(e.target.value);
  };

  const handleLoginSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const body = { email: userData.email, password: userData.password, type: loginType };
    const data = await validateLogin(body);
    if (data && data.status === 'Successful') {
      setLoggedIn(true);
      setLoggedInUserData(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      setShow(false);
      history.replace('/');
    } else {
      data.message ? setFormError(data.message) : setFormError(data.status);
      setTimeout(() => setFormError(''), 2000);
    }
  };

  const handleSignupSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const emailStatus = status('email');
    const passwordStatus = status('password');
    if (emailStatus !== '' || passwordStatus !== '') {
      console.log(emailStatus, passwordStatus);
    }
    const body = { ...userData, type: userType, favorites: [] };
    const data = await validateSignup(body);
    if (data.status === 'Successful') {
      setLoggedIn(true);
      setLoggedInUserData(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      setShow(false);
      if (userType === 'host') history.replace('/host/listroom');
    } else {
      data.message ? setFormError(data.message) : setFormError(data.status);
      setTimeout(() => setFormError(''), 2000);
    }

    console.log(body);
  };

  const validateLogin = async (body: { email: string; password: string; type: string; }) => {
    setLoading(true);
    try {
      const { data } = await axios.post('https://fierce-plains-40745.herokuapp.com/api/login', body, { headers: { 'content-type': 'application/json' } });
      console.log(data);
      return data;
    } catch ({ message }) {
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
    history.replace('/');
  };

  const validateSignup = async (body: { favorites: string[]; type: any; email: string; password: string; firstName: string; lastName: string; phone: string; }) => {
    setLoading(true);
    try {
      const { data } = await axios.post('https://fierce-plains-40745.herokuapp.com/api/signup', body, { headers: { 'content-type': 'application/json' } });
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setShow(!show);
  };
  const guestSignUp = () => {
    setSignup(true);
    setShow(true);
    setUserType('guest');
  };
  const hostSignUp = () => {
    setSignup(true);
    setShow(true);
    setUserType('host');
  };
  const signIn = () => {
    setSignup(false);
    setShow(true);
  };

  return (
    <AuthContext.Provider value={{
      loading,
      loginType,
      handleEmailInputChange,
      handlePasswordInputChange,
      handlePasswordConfirmationChange,
      handleFirstNameInput,
      handleLastNameInput,
      handlePhoneInput,
      handleSelect,
      handleLoginSubmit,
      handleSignupSubmit,
      data: userData,
      passwordConfirmation,
      toggleModal,
      guestSignUp,
      hostSignUp,
      signIn,
      show,
      isSignup,
      userType,
      fetchRoomsData,
      roomsData,
      searchResults,
      handleSearchResults,
      showResults,
      route: props.location.pathname,
      loggedIn,
      userData: loggedInUserData,
      logout,
      roomShown,
      handleRoomClick,
      formError,
      handleFavorites,
      favorites,
      updateUser,
      submitBooking,
      guestBecomeHost,
    }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const AuthContextProvider = withRouter(AuthContextComp);
export default AuthContext;
