import React, { useMemo } from "react";
import { StyleSheet, SectionList } from "react-native";
import { useStock } from "@/contexts/StockContext";
import { StockItem } from "@/types/stock";
import { BatchAccordion } from "@/components/products";
import { ThemedText } from "@/components/shared";

interface Props {
  productId: number;
}

const InventorySection = ({ productId }: Props) => {
  const { batches, controller, refreshProducts } = useStock();

  console.log("batches", batches) // dev-log

  const sections = useMemo(() => {
    const productBatches = batches.filter((b) => b.product_id === productId);
    const groups: { [key: string]: { [batchNum: string]: StockItem[] } } = {};

    productBatches.forEach((batch) => {
      const dateKey = new Date(batch.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateKey]) groups[dateKey] = {};
      if (!groups[dateKey][batch.batch_number])
        groups[dateKey][batch.batch_number] = [];

      groups[dateKey][batch.batch_number].push(batch);
    });

    return Object.keys(groups).map((date) => ({
      title: date,
      data: Object.entries(groups[date]).map(([num, items]) => ({
        batchNumber: num,
        items,
      })),
    }));
  }, [batches, productId]);

  const handleDeleteBatch = async (batchId: number) => {
    try {
      await controller.deleteBatch(batchId);
      await refreshProducts();
    } catch (error) {
      console.error("Failed to delete batch", error);
    }
  };



  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.batchNumber}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section: { title } }) => (
        <ThemedText style={styles.sectionHeaderText}>{title}</ThemedText>
      )}
      renderItem={({ item }) => (
        <BatchAccordion
          title={`Batch #${item.batchNumber}`}
          items={item.items}
          onDelete={handleDeleteBatch}
        />
      )}
      contentContainerStyle={styles.listPadding}
    />
  );
};

export default InventorySection;

const styles = StyleSheet.create({
  listPadding: { paddingBottom: 40 },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 10,
  },
});
