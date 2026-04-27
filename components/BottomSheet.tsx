import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Altura máxima como percentagem do ecrã, ex: "92%" ou 0.92. Default: "92%" */
  maxHeight?: string | number;
  /** Se true, o conteúdo interno NÃO é scrollável (usa BottomSheetView em vez de BottomSheetScrollView) */
  noScroll?: boolean;
  children: React.ReactNode;
};

export function BottomSheet({ visible, onClose, maxHeight = "92%", noScroll = false, children }: Props) {
  const ref = useRef<GorhomBottomSheet>(null);

  // Converte "92%" → 0.92 para snapPoints
  const snap = useMemo(() => {
    if (typeof maxHeight === "string" && maxHeight.endsWith("%")) {
      return maxHeight; // gorhom aceita "92%" directamente
    }
    return maxHeight;
  }, [maxHeight]);

  const snapPoints = useMemo(() => [snap], [snap]);

  // Abre ao montar / quando visible muda para true
  useEffect(() => {
    if (visible) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [visible]);

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!visible) return null;

  return (
    <GorhomBottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      handleStyle={styles.handleArea}
    >
      {noScroll ? (
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      ) : (
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {children}
        </BottomSheetScrollView>
      )}
    </GorhomBottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#181818",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderTopColor: "#b8972e",
  },
  handleArea: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#b8972e",
  },
  content: {
    paddingBottom: 40,
  },
});
