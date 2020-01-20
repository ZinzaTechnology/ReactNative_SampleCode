import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  Dimensions
} from "react-native";
import { default as modalTypes } from "./Modals";
import Icon from "react-native-vector-icons/AntDesign";
import { isIphoneX } from "../logic/features";
const MODAL_TYPES = {
  alert: modalTypes.AlertModal,
  confirm: modalTypes.ConfirmModal,
  loading: modalTypes.LoadingModal,
  content: modalTypes.ContentModal,
  download: modalTypes.DownloadModal,
  update: modalTypes.UpdateModal
};

class ModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      marginBottom: 0
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = e => {
    const keyboardHeight = e.endCoordinates.height - (isIphoneX ? 34 : 0);

    this.setState({
      marginBottom: Platform.OS === "ios" ? keyboardHeight : 0
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      marginBottom: 0
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        modalIsOpen: nextProps.modalProps.open
      });
    }
  }

  closeModal = event => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    if (!this.props.modalType) {
      return null;
    }
    const SpecifiedModal = MODAL_TYPES[this.props.modalType];
    const { modalProps } = this.props;
    const closeable =
      modalProps.closeable !== undefined ? modalProps.closeable : true;
    if (
      this.props.modalType === "loading" ||
      this.props.modalType == "download"
    ) {
      return <SpecifiedModal {...modalProps} />;
    }
    return (
      <Modal
        style={{ flex: 1 }}
        animationsType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => modalProps.closeModal()}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)"
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <View style={{ flexDirection: "row" }}>
                {closeable && (
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => {
                      modalProps.closeModal();
                    }}
                    accessible={true}
                    accessibilityLabel="Tắt thông báo"
                  >
                    <Icon name={"close"} size={20} color={"white"} />
                  </TouchableOpacity>
                )}

                <View style={styles.modalContainer}>
                  {/* show modal depend by type */}
                  <SpecifiedModal {...modalProps} />
                </View>
              </View>
            </View>
          </View>
          <View style={{ height: this.state.marginBottom }} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  modalClose: {
    position: "absolute",
    top: -40,
    right: 0,
    height: 30,
    width: 30,
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  }
});

function mapStateToProps(state) {
  return {
    ...state.modal
  };
}

export default connect(mapStateToProps)(ModalContainer);
