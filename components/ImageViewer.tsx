import React, { useRef, useState, useCallback } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  StatusBar,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

type Props = {
  images: string[];           // array de URIs
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
};

export function ImageViewer({ images, initialIndex = 0, visible, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);

  // Reset index quando abre
  const handleShow = useCallback(() => setIndex(initialIndex), [initialIndex]);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const lastScale = useRef(1);
  const lastTX = useRef(0);
  const lastTY = useRef(0);

  const resetTransform = () => {
    lastScale.current = 1;
    lastTX.current = 0;
    lastTY.current = 0;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  // Swipe horizontal para mudar imagem (só quando não ampliado)
  const swipePan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        lastScale.current <= 1 && Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -50 && index < images.length - 1) {
          setIndex((i) => i + 1);
        } else if (gs.dx > 50 && index > 0) {
          setIndex((i) => i - 1);
        }
      },
    })
  ).current;

  const uri = images[index];

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.overlay} {...swipePan.panHandlers}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeTxt}>✕</Text>
        </TouchableOpacity>

        {/* Counter */}
        {images.length > 1 && (
          <View style={styles.counter}>
            <Text style={styles.counterTxt}>{index + 1} / {images.length}</Text>
          </View>
        )}

        {/* Image */}
        <Animated.Image
          source={{ uri }}
          style={[
            styles.image,
            { transform: [{ scale }, { translateX }, { translateY }] },
          ]}
          resizeMode="contain"
        />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            {index > 0 && (
              <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={() => { resetTransform(); setIndex((i) => i - 1); }}>
                <Text style={styles.arrowTxt}>‹</Text>
              </TouchableOpacity>
            )}
            {index < images.length - 1 && (
              <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={() => { resetTransform(); setIndex((i) => i + 1); }}>
                <Text style={styles.arrowTxt}>›</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Double-tap reset hint */}
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.97)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: W,
    height: H * 0.8,
  },
  closeBtn: {
    position: "absolute",
    top: 52,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeTxt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  counter: {
    position: "absolute",
    top: 58,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  counterTxt: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "700",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -28,
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  arrowLeft:  { left: 12 },
  arrowRight: { right: 12 },
  arrowTxt: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "300",
    lineHeight: 40,
  },
});
