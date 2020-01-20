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

class FilterSponsor extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const isBottomSheetOpen = params ? params.isBottomSheetOpen : false;
    return {
      headerTitle: (
        <Text
          style={headerStyle.title}
          importantForAccessibility={isBottomSheetOpen ? "no" : "auto"}
        >
          Nhà tài trợ
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
    this.props.fetchSponsor();
  }

  toggleFilter = sponsorId => {
    if (this.props.activeFilter == sponsorId) {
      this.props.deactiveFilterSponsor();
    } else {
      this.props.activeFilterSponsor(sponsorId);
    }
  };

  renderItem(data) {
    const { name, id: sponsorId } = data;
    const { activeFilter } = this.props;
    return (
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => this.toggleFilter(sponsorId)}
      >
        <Text style={styles.filterText}>{name}</Text>
        {sponsorId == activeFilter ? (
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
          <Text style={styles.emptyText}>Chưa có danh sách nhà tài trợ</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    const { sponsorData, isFetching, error, isBottomSheetOpen } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <FlatList
          data={sponsorData}
          refreshing={false}
          extraData={sponsorData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() =>
            this.renderFooter(sponsorData, isFetching, error)
          }
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { sponsor, netInfo, bottomSheet } = state;
  const { isFetching, items: sponsorData, error, activeFilter } = sponsor;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isFetching,
    sponsorData,
    error,
    activeFilter,
    connecting,
    isBottomSheetOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSponsor: () => dispatch(actions.fetchSponsorDataIfNeed()),
    activeFilterSponsor: sponsorId =>
      dispatch(actions.activeFilterSponsor(sponsorId)),
    deactiveFilterSponsor: _ => dispatch(actions.deactiveFilterSponsor())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterSponsor);
