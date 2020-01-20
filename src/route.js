import React from "react";
import { Dimensions, View } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import A01 from "./screens/A01";
import A02 from "./screens/A02";
import A03 from "./screens/A03";
import A04 from "./screens/A04";
import A10 from "./screens/A10";
import A06 from "./screens/A06";
import A07 from "./screens/A07";
import A09 from "./screens/A09";
import A11 from "./screens/A11";
import A12 from "./screens/A12";
import Filter from "./screens/Filter";
import FilterCategory from "./screens/FilterCategory";
import FilterAuthor from "./screens/FilterAuthor";
import FilterSpeaker from "./screens/FilterSpeaker";
import FilterSponsor from "./screens/FilterSponsor";
import DrawerComponent from "./components/DrawerComponent";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";

const { width, height } = Dimensions.get("screen");
export const appDrawerData = {
  A03,
  A06,
  A07,
  A09,
  A11,
  A12
};

const StackDrawer = createStackNavigator(
  {
    AppDrawer: createDrawerNavigator(appDrawerData, {
      unmountInactiveRoutes: true,
      drawerPosition: "left",
      drawerLockMode: "locked-open",
      contentComponent: () => <DrawerComponent />,
      style: { zIndex: 9999 },
      drawerWidth: width
      // unmountInactiveRoutes: false
    })
  },
  {
    defaultNavigationOptions: { header: null }
  }
);

const SearchStack = createStackNavigator(
  {
    A04: {
      screen: A04
    },
    Filter: {
      screen: Filter
    },
    FilterCategory: {
      screen: FilterCategory
    },
    FilterAuthor: {
      screen: FilterAuthor
    },
    FilterSpeaker: {
      screen: FilterSpeaker
    },
    FilterSponsor: {
      screen: FilterSponsor
    }
  },
  {
    headerLayoutPreset: "center",
    initialRouteName: "A04"
  }
);

const MainStack = createStackNavigator(
  {
    StackDrawer: {
      screen: StackDrawer,
      navigationOptions: { header: null }
    },
    SearchBook: {
      screen: SearchStack,
      navigationOptions: { header: null }
    },
    A10
  },
  {
    initialRouteName: "StackDrawer"
  }
);

// auth stack
export const AuthStack = createStackNavigator(
  {
    A01: {
      screen: A01,
      navigationOptions: { header: null }
    },
    A02: {
      screen: A02,
      navigationOptions: { header: null }
    }
  },
  {
    initialRouteName: "A02"
  }
);

// create root navigator
const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      AuthStack,
      MainStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default RootNavigator;
