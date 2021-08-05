/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    useContext, useState, useEffect, useLayoutEffect,
  } from 'react';
  import AuthContext from '../../store/AuthContext';
  import axios from "axios"
  import lagos from '../../assets/lagos.svg';
  import abuja from '../../assets/abuja.svg';
  import ibadan from '../../assets/ibadan.svg';
  import Item from '../Item/Item';
  import ListItem from '../RoomsList/ListItem';
  import styles from '../RoomsList/RoomsList.module.css';
  import Spinner from "../Spinner/Spinner"
  
  const Bookings = () => {
    useLayoutEffect(() => {
      // window.scrollTo(0, 0);
    }, []);
    const ctx = useContext(AuthContext);
    // const [state, setState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ bookings, setBookings ] = useState([]);

    const getBookings = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`https://fierce-plains-40745.herokuapp.com/api/getBookings/${ctx.userData.email}`);
          const { data } = await res;
          setBookings(data.userBookings);
          console.log('roomsData', bookings, 'data', data);
          setLoading(false);
        } catch (e) {
          console.log(e);
        }
    }
    useEffect(() => {
      getBookings()
    }, []);

    // const allBookings = bookings.map((id) => ctx.roomsData.find((room) => room.roomId === id));
    return (
        <>
          {loading && <Spinner />}
      <div className={styles.Wrapper}>
        <h3 style={{ fontWeight: 700, padding: '20px 0' }}>Your Bookings</h3>
        {bookings.length === 0 ? <h4 style={{ textAlign: 'center' }}>A list of apartments you have booked will appear here. List is currently empty</h4> : bookings.map((room) => room && <ListItem favClick={ctx.handleFavorites} click={ctx.handleRoomClick} favorites={ctx.favorites} room={room} />)}
        <section className={styles.Explore}>
          <h2>Explore Locations</h2>
          <div className={styles.Items}>
            <Item title="Lagos" image={lagos} hover />
            <Item title="Abuja" image={abuja} hover />
            <Item title="Portharcourt" image={abuja} hover />
            <Item title="Ibadan" image={ibadan} hover />
          </div>
        </section>
      </div>
      </>
    );
  };
  
  export default Bookings;
  