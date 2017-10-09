import express from "express";
import authenticate from '../middlewares/authenticate';
import request from "request-promise";
import { parseString } from 'xml2js';

const router = express.Router();
router.use(authenticate);

router.get("/search", (req, res) => {
  request
    .get(
      `https://www.goodreads.com/search/index.xml?key=KSOxyP3avWDu9MmSY2XzA&q=${req.query.q}`
    )
    .then(result =>
    parseString(result, (err, goodreadsResult) =>
      res.json({
        books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(
          work => ({
            goodreadsId: work.best_book[0].id[0]._,
            title: work.best_book[0].title[0],
            authors: work.best_book[0].author[0].name[0],
            covers: [work.best_book[0].image_url[0]]
          })
        )
      })
    )
  );

  // res.json({
  //   books: [
  //     {
  //       goodreadsId: 1,
  //       title: "1984",
  //       authors: "Orwell",
  //       covers: [
  //         "https://flavorwire.files.wordpress.com/2011/06/www-robinmalau.jpeg",
  //         "http://booksat.scarlettrugers.com/bookcoverdesign/wp-content/uploads/2013/10/1984-book-cover.jpeg"
  //       ],
  //       pages: 198
  //     },
  //     {
  //       goodreadsId: 2,
  //       title: "Three Men in a Boat",
  //       authors: "Jerome K. Jerome",
  //       covers: [
  //         "https://cdn.slidesharecdn.com/ss_thumbnails/thethreemeninaboatpreview-140122042355-phpapp01-thumbnail-4.jpg?cb=1390365419",
  //         "https://images-na.ssl-images-amazon.com/images/I/51l-w0Q0J%2BL._SX302_BO1,204,203,200_.jpg"
  //       ],
  //       pages: 256
  //     }
  //   ]
  // })
});

export default router;
