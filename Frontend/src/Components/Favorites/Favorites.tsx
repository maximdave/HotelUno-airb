/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
  useContext, useState, useEffect, useLayoutEffect,
} from 'react';
import AuthContext from '../../store/AuthContext';
import lagos from '../../assets/lagos.svg';
import abuja from '../../assets/abuja.svg';
import ibadan from '../../assets/ibadan.svg';
import Item from '../Item/Item';
import ListItem from '../RoomsList/ListItem';
import styles from '../RoomsList/RoomsList.module.css';

const Favorites = () => {
  useLayoutEffect(() => {
    // window.scrollTo(0, 0);
  }, []);
  const ctx = useContext(AuthContext);
  // const [state, setState] = useState(false);
  const [favs, setFavs] = useState(ctx.favorites);
  useEffect(() => {
    setFavs(ctx.favorites);
  }, [ctx.favorites, ctx.handleFavorites]);
  // const iconClick = (id) => {
  //     setState(!state);
  //     props.favClick(id)
  // }
  const favorites = favs.map((id) => ctx.roomsData.find((room) => room.roomId === id));
  return (
    <div className={styles.Wrapper}>
      <h3 style={{ fontWeight: 700, padding: '20px 0' }}>Your Favorites</h3>
      {favorites.length === 0 ? <h4 style={{ textAlign: 'center' }}>A list of apartments you have favorited will appear here. List is currently empty</h4> : favorites.map((room) => room && <ListItem favClick={ctx.handleFavorites} click={ctx.handleRoomClick} favorites={ctx.favorites} room={room} />)}
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
  );
};

export default Favorites;
