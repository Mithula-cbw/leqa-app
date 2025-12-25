import "./global.css";
import "./i18n";
import React from "react";
import { Text, View, StatusBar, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageProvider, useLanguage } from "./src/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const { isEng, changeLanguage } = useLanguage();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{t("test")}</Text>
        <Button
          title={isEng ? "Switch to Sinhala" : "Switch to English"}
          onPress={() => changeLanguage(isEng ? "si" : "en")}
        />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  );
}
