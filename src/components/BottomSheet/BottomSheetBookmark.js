import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import * as constants from "../../logic/constants";
import * as Utils from "../../logic/utils";
import styles from "./styles/BottomSheetBookmarkStyle";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import BottomSheetTouchable from "./BottomSheetTouchable";

const BookmarkHeader = props => {
  return <Text style={styles.title}>Danh sách ghi chú</Text>;
};

const BookmarkItem = props => {
  const {
    data,
    removeBookmark,
    updateBookmark,
    seekToBookmark,
    editIndex,
    setEdit,
    index
  } = props;
  const { duration, comment, id } = data;
  const time = Utils.formatTime(duration);
  const editing = index == editIndex;
  const [textEdit, setTextEdit] = useState("");

  useEffect(() => {
    if (editIndex == index) {
      setTextEdit(comment);
    }
  }, [editIndex]);

  return (
    <View style={styles.itemContainer}>
      <BottomSheetTouchable
        style={styles.removeBtn}
        onPress={() => removeBookmark(id)}
      >
        <EvilIcons name="minus" size={24} color={"black"} />
      </BottomSheetTouchable>
      {editing ? (
        <View style={styles.contentWrap}>
          <View style={[styles.timeWrap, { backgroundColor: "#EF7225" }]}>
            <Text style={[styles.timeText, { color: "white" }]}>{time}</Text>
          </View>
          <TextInput
            autoFocus={true}
            placeholder={"Thêm..."}
            placeholderTextColor={"#C7C7C7"}
            value={textEdit}
            style={styles.inputEdit}
            onChangeText={setTextEdit}
          />

          <BottomSheetTouchable
            style={styles.btnEdit}
            onPress={() => updateBookmark(id, textEdit)}
          >
            <Text style={styles.editText}>Change</Text>
          </BottomSheetTouchable>
        </View>
      ) : (
        <View style={styles.contentWrap}>
          <View style={{ flex: 1 }}>
            <BottomSheetTouchable
              style={styles.textWrap}
              onPress={() => seekToBookmark(duration)}
            >
              <View style={[styles.timeWrap, { backgroundColor: "#C7C7C7" }]}>
                <Text style={[styles.timeText, { color: "black" }]}>
                  {time}
                </Text>
              </View>
              <Text style={styles.content}>{comment}</Text>
            </BottomSheetTouchable>
          </View>
          <BottomSheetTouchable
            style={styles.btnEdit}
            onPress={() => setEdit(index)}
          >
            <Text style={styles.editText}>Edit</Text>
          </BottomSheetTouchable>
        </View>
      )}
    </View>
  );
};

const BookmarkFooter = props => {
  const { isFetching, error, data, connecting } = props;
  if (!connecting) {
    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.emptyText}>{constants.CONNECTION_FAIL}</Text>
      </View>
    );
  } else if (isFetching) {
    return (
      <ActivityIndicator
        size={"large"}
        style={{ color: "#000", marginVertical: 10 }}
      />
    );
  } else if (error) {
    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.emptyText}>Error</Text>
      </View>
    );
  } else {
    return null;
  }
};

const BottomSheetBookmark = props => {
  const {
    trackBookmark,
    removeBookmark,
    seekToBookmark,
    editBookmark,
    isGetFetching,
    errorGet,
    connecting
  } = props;

  const [editIndex, setEdit] = useState(null);

  updateBookmark = (index, textEdit) => {
    editBookmark(index, textEdit);
    setEdit(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trackBookmark}
        refreshing={false}
        extraData={trackBookmark}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <BookmarkItem
            editIndex={editIndex}
            setEdit={setEdit}
            data={item}
            index={index}
            removeBookmark={removeBookmark}
            updateBookmark={updateBookmark}
            seekToBookmark={seekToBookmark}
          />
        )}
        ListHeaderComponent={<BookmarkHeader />}
        ListFooterComponent={
          <BookmarkFooter
            isFetching={isGetFetching}
            error={errorGet}
            data={trackBookmark}
            connecting={connecting}
          />
        }
      />
    </View>
  );
};
export default BottomSheetBookmark;
