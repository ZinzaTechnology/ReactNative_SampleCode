import React, { Component } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  Text
} from "react-native";
import TrackPlayer from "react-native-track-player";
import styles from "./styles/A03Style";
import { DrawerActions } from "react-navigation";
import headerStyle from "../components/styles/A03HeaderStyle";
import Icon from "react-native-vector-icons/FontAwesome";
import A03Item from "../components/A03Item";
import * as actions from "../logic/actions";
import { connect } from "react-redux";
import RNSecureStorage from "rn-secure-storage";
import * as constants from "../logic/constants";

class A03 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getLibrary();
  }

  componentDidUpdate(prevProps) {
    const { authorError } = this.props;
    if (prevProps.authorError == null && authorError) {
      __DEV__ && console.log("A03 not authen: ", authorError);
      this.signOut();
    }
    
  }

  signOut = async () => {
    try {
      await RNSecureStorage.remove(constants.AS_AUTHORIZATION);
      this.props.hidePlayer();
      await TrackPlayer.reset();
      this.props.navigation.navigate("AuthStack");
      this.props.updatePlayback(null);
      const authorization = await RNSecureStorage.get(
        constants.AS_AUTHORIZATION
      );
      console.log("AUTHEN TOKEN AFTER REMOVE: ", authorization);
    } catch (e) {
      __DEV__ && console.log("error signout: ", e);
    }
  };

  navToBookDetail = async data => {
    this.props.navigation.navigate("A10", {
      bookData: data
    });
  };

  renderItem = data => {
    const { time } = this.props;
    return (
      <A03Item
        data={data}
        onPress={() => this.navToBookDetail(data)}
        timeRead={time}
      />
    );
  };

  openDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  render() {
    const { books, isDrawerOpen, isBottomSheetOpen } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isDrawerOpen || isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <View style={headerStyle.header}>
          <View style={headerStyle.titleWrap}>
            <Text style={headerStyle.title}>Your book</Text>
          </View>
          <TouchableOpacity
            onPress={this.openDrawer}
            accessible={true}
            accessibilityLabel="Menu"
            style={headerStyle.btn}
          >
            <Icon name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Tìm kiếm"
            onPress={() => this.props.navigation.navigate("A04")}
            style={headerStyle.btn}
          >
            <Icon name={"search"} size={20} color={"black"} />
          </TouchableOpacity>
        </View>

        <View
          style={{ paddingHorizontal: 10, flex: 1, backgroundColor: "#F6F9FA" }}
        >
          <FlatList
            data={books}
            numColumns={2}
            refreshing={false}
            extraData={books}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => this.renderItem(item)}
            ListHeaderComponent={
              <Text style={styles.textHeader}>Library</Text>
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const {
    playback,
    author,
    library,
    time,
    drawer,
    bottomSheet
  } = state;
  const { error: authorError } = author;
  const { books } = library;
  const { isOpen: isDrawerOpen } = drawer;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    authorError,
    playback,
    books,
    time,
    isDrawerOpen,
    isBottomSheetOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    getLibrary: () => dispatch(actions.getLibraryData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(A03);
