import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";
import styles from "./styles/FilterStyles";
import headerStyle from "../components/styles/A04HeaderStyle";
import Icon from "react-native-vector-icons/FontAwesome";
import * as actions from "../logic/actions";
import { connect } from "react-redux";
import * as constants from "../logic/constants";

class FilterSpeaker extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const isBottomSheetOpen = params ? params.isBottomSheetOpen : false;
    return {
      headerTitle: (
        <Text
          style={headerStyle.title}
          importantForAccessibility={isBottomSheetOpen ? "no" : "auto"}
        >
          Người đọc
        </Text>
      ),
      headerRight: null,
      headerLeft: (
        <View
          importantForAccessibility={
            isBottomSheetOpen ? "no-hide-descendants" : "auto"
          }
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              headerStyle.btn,
              {
                flexDirection: "row"
              }
            ]}
          >
            <Icon
              style={headerStyle.icon}
              name="angle-left"
              size={30}
              color="black"
            />
            <Text style={headerStyle.title}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        borderBottomColor: "#A9A9A9",
        shadowOpacity: 0,
        shadowOffset: {
          height: 0
        },
        shadowRadius: 0,
        borderBottomWidth: 1
      }
    };
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { setParams } = this.props.navigation;
    setParams({ isBottomSheetOpen: this.props.isBottomSheetOpen });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isBottomSheetOpen != this.props.isBottomSheetOpen) {
      const { setParams } = this.props.navigation;
      setParams({ isBottomSheetOpen: this.props.isBottomSheetOpen });
    }
  }

  componentDidMount() {
    this.props.fetchSpeaker();
  }

  toggleFilter = speakerId => {
    if (this.props.activeFilter == speakerId) {
      this.props.deactiveFilterSpeaker();
    } else {
      this.props.activeFilterSpeaker(speakerId);
    }
  };

  renderItem(data) {
    const { name, id: speakerId } = data;
    const { activeFilter } = this.props;
    return (
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => this.toggleFilter(speakerId)}
      >
        <Text style={styles.filterText}>{name}</Text>
        {speakerId == activeFilter ? (
          <Icon name={"check-circle"} size={25} color={"#EF7225"} />
        ) : (
          <Icon name={"circle-thin"} size={25} color={"black"} />
        )}
      </TouchableOpacity>
    );
  }

  renderFooter(data, isFetching, error) {
    if (!this.props.connecting) {
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
          <Text style={styles.emptyText}>Có lỗi xảy ra</Text>
        </View>
      );
    } else if (!isFetching && data.length === 0) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.emptyText}>Chưa có danh sách người đọc</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    const { speakerData, isFetching, error, isBottomSheetOpen } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <FlatList
          data={speakerData}
          refreshing={false}
          extraData={speakerData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() =>
            this.renderFooter(speakerData, isFetching, error)
          }
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { speaker, netInfo, bottomSheet } = state;
  const { isFetching, items: speakerData, error, activeFilter } = speaker;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isFetching,
    speakerData,
    error,
    activeFilter,
    connecting,
    isBottomSheetOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSpeaker: () => dispatch(actions.fetchSpeakerDataIfNeed()),
    activeFilterSpeaker: speakerId =>
      dispatch(actions.activeFilterSpeaker(speakerId)),
    deactiveFilterSpeaker: _ => dispatch(actions.deactiveFilterSpeaker())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterSpeaker);
