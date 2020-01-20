import React, { Component } from "react";
import {
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import actions from "../../logic/actions";
import Animated from "react-native-reanimated";
import RNFS from "react-native-fs";

const AnimatedView = Animated.View;

const DonwloadModal = modalProps => {
  const { closeModal, progress, jobId, stopDownload } = modalProps;
  stopDownloadProcess = async () => {
    if (jobId) {
      await RNFS.stopDownload(jobId);
      stopDownload();
    }
  };

  return (
    <Modal
      style={{ flex: 1 }}
      animationsType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => closeModal()}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)"
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.modalContainer}>
                <View style={styles.downloadModal}>
                  <Text style={styles.textDownload}>Please wait...</Text>
                  <ProgressBar downloadProcess={progress} />

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={stopDownloadProcess}
                  >
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* <View style={{ height: this.state.marginBottom }} /> */}
      </View>
    </Modal>
  );
};

const mapStateToProps = state => {
  const { download } = state;
  const { progress, jobId } = download;
  return {
    progress,
    jobId
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DonwloadModal);

export const ProgressBar = props => {
  const { downloadProcess } = props;
  return (
    <View style={styles.processContainer}>
      <AnimatedView style={{ flex: downloadProcess / 100 }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#EF7225", "#fcc9a9"]}
          style={{ flex: 1 }}
        />
      </AnimatedView>

      <View style={styles.rateContainer}>
        <Text style={styles.rateText}>{downloadProcess}%</Text>
      </View>
    </View>
  );
};

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
  cancelBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "black",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "center"
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
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
  },
  downloadWrapper: {
    flexDirection: "row",
    width: 150,
    justifyContent: "flex-end"
  },
  downloadModal: {
    padding: 20
  },
  textDownload: {
    color: "black",
    paddingBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center"
  },
  processContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    height: 20,
    overflow: "hidden",
    borderRadius: 10,
    borderColor: "#EF7225",
    borderWidth: 1
  },
  rateContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignContent: "center"
  },
  rateText: {
    textAlign: "center",
    color: "black",
    fontSize: 14
  }
});
