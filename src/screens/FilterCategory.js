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

class FilterCategory extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const isBottomSheetOpen = params ? params.isBottomSheetOpen : false;
    return {
      headerTitle: (
        <Text
          importantForAccessibility={isBottomSheetOpen ? "no" : "auto"}
          style={headerStyle.title}
        >
          Thể loại
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
    this.props.fetchCategory();
  }

  toggleFilter = categoryId => {
    if (this.props.activeFilter == categoryId) {
      this.props.deactiveFilterCategory();
    } else {
      this.props.activeFilterCategory(categoryId);
    }
  };

  renderItem(data) {
    const { name, id: categoryId } = data;
    const { activeFilter } = this.props;
    return (
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => this.toggleFilter(categoryId)}
      >
        <Text style={styles.filterText}>{name}</Text>
        {categoryId == activeFilter ? (
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
          <Text style={styles.emptyText}>Chưa có danh sách thể loại</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    const { categoryData, isFetching, error, isBottomSheetOpen } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <FlatList
          data={categoryData}
          refreshing={false}
          extraData={categoryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() =>
            this.renderFooter(categoryData, isFetching, error)
          }
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { category, netInfo, bottomSheet } = state;
  const { isFetching, items: categoryData, error, activeFilter } = category;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isFetching,
    categoryData,
    error,
    activeFilter,
    connecting,
    isBottomSheetOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCategory: () => dispatch(actions.fetchCategoryDataIfNeed()),
    activeFilterCategory: categoryId =>
      dispatch(actions.activeFilterCategory(categoryId)),
    deactiveFilterCategory: _ => dispatch(actions.deactiveFilterCategory())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterCategory);
