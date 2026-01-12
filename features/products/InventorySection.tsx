import React, { useMemo, useState } from "react";
import { StyleSheet, SectionList } from "react-native";
import { useStock } from "@/contexts/StockContext";
import { StockItem } from "@/types/stock";
import { BatchAccordion } from "@/components/products";
import { ThemedText } from "@/components/shared";

interface Props {
  productId: number;
  ListHeaderComponent?: React.ReactElement;
}

const InventorySection = ({ productId, ListHeaderComponent }: Props) => {
  const { batches } = useStock();
  

  console.log("batches", batches);

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

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.batchNumber}
      stickySectionHeadersEnabled={false}
      // Pass the header here so it scrolls with the list
      ListHeaderComponent={ListHeaderComponent}
      renderSectionHeader={({ section: { title } }) => (
        <ThemedText style={styles.sectionHeaderText}>{title}</ThemedText>
      )}
      renderItem={({ item }) => (
        <BatchAccordion
          title={`Batch #${item.batchNumber}`}
          items={item.items}
          batchNumber={item.batchNumber}
        />
      )}
      contentContainerStyle={styles.listPadding}
    />
  );
};

export default InventorySection;

const styles = StyleSheet.create({
  listPadding: { paddingBottom: 280 },
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
