const express = require('express');
const router = express.Router();

import Promise from 'bluebird';
import SpotifyWebApi from 'spotify-web-api-node';

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: '07f5f9fe4f5e416d890dc9cbdbd1db2a',
  clientSecret: '4175ac8283a74c86815b9e43414cc30e',
  redirectUri: 'http://www.example.com/callback'
});

// spotifyApi.setAccessToken('<your_access_token>');

const album_types = 'album,single,appears_on,compilation';
const market = 'US';

const artistId = '43ZHCT0cAZBISjO8DG9PnE';

const limit = 50;

/* GET users listing. */
router.get('/', (req, res, next) => {
  let allAlbums = [];
  _getArtistAlbums(artistId, limit, 0, allAlbums)
  .then((albums) => {
    // res.json(albums);
    albums.map((album) => {
      album.tracks = _getAlbumTracks(album.id, 50, 0);
    });
    res.json(albums);
  })
  .then((albums) => {
    res.json(albums);
  })
  .catch((err) => {
    res.json(err);
  });
});

function _getArtistAlbums (id, limit, offset, albums) {
  return new Promise((resolve, reject) => {
    spotifyApi.getArtistAlbums(artistId, {
      album_type: album_types,
      market: market,
      limit: limit,
      offset: offset
    })
    .then((data) => {
      albums = albums.concat(data.body.items);
      if (data.body.next) {
        resolve(_getArtistAlbums(artistId, limit, offset + 50, albums));
      } else {
        resolve(albums);
      }
    }, (err) => {
      reject(err);
    });
  });
}

function _getAlbumTracks (id, limit, offset) {
  return new Promise((resolve, reject) => {
    console.log(id);
    resolve([]);
  });
  // return new Promise((resolve, reject) => {
  //   spotifyApi.getAlbumTracks(id, {
  //     limit: limit,
  //     offset: offset
  //   })
  //   .then((data) => {
  //     console.log(data.items);
  //     resolve(data.items);
  //   }, (err) => {
  //     reject(err);
  //   })
  // })
}

module.exports = router;
