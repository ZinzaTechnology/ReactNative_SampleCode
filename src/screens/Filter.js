import React, { Component } from "react";
import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import styles from "./styles/FilterStyles";
import headerStyle from "../components/styles/A04HeaderStyle";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as actions from "../logic/actions";
import { connect } from "react-redux";

const filterData = [
  { title: "Thể loại", screen: "FilterCategory" },
  { title: "Tác giả", screen: "FilterAuthor" },
  { title: "Nhà tài trợ", screen: "FilterSponsor" },
  { title: "Người đọc", screen: "FilterSpeaker" }
];

class Filter extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const isBottomSheetOpen = params ? params.isBottomSheetOpen : false;
    return {
      headerTitle: (
        <Text
          style={headerStyle.title}
          importantForAccessibility={isBottomSheetOpen ? "no" : "auto"}
        >
          Bộ lọc
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
              accessible={false}
            />
            <Text accessible={false} style={headerStyle.title}>
              Quay lại
            </Text>
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
    this.state = {};
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

  filter = screen => {
    this.props.navigation.navigate(screen);
  };

  render() {
    const { isBottomSheetOpen } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {filterData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterItem}
              onPress={() => this.filter(item.screen)}
            >
              <Text style={styles.filterText}>{item.title}</Text>
              <Icon name={"angle-right"} size={20} color={"black"} />
            </TouchableOpacity>
          ))}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { bottomSheet } = state;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isBottomSheetOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
