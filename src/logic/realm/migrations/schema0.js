"use strict";

import Realm from "realm";

class Chapter extends Realm.Object {}
Chapter.schema = {
  name: "Chapter",
  properties: {
    id: "int?",
    index: "int?",
    name: "string?",
    title: "string?",
    album: "string?",
    artist: "string?",
    artwork: "string?",
    audioUrl: "string?",
    bookId: "int?",
    created: "int?",
    duration: "string?",
    isDownloaded: "bool?",
    read: "int?",
    url: "string?"
  }
};

class Book extends Realm.Object {}
Book.schema = {
  name: "Book",
  properties: {
    id: "int?",
    title: "string?",
    authorId: "int?",
    authorName: "string?",
    avatar: "string?",
    categoryId: "int?",
    categoryName: "string?",
    created: "int?",
    creator: "string?",
    creatorName: "string?",
    description: "string?",
    duration: "string?",
    speakerId: "int?",
    speakerName: "string?",
    sponsorId: "int?",
    isDownloaded: "bool?",
    sponsorName: "string?",
    read: "int?",
    downloadAt: "int?",
    chapters: { type: "list", objectType: "Chapter" }
  }
};

export default {
  schema: [ Chapter, Book ],
  schemaVersion: 0
};
