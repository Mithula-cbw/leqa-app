import "./global.css";
import React from 'react';
import { Text, View, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    // SafeAreaView prevents content from hiding under the camera notch
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-1 justify-center items-center p-6">
        {/* Our themed card */}
        <View className="bg-surface p-8 rounded-[32px] shadow-xl border border-slate-100 items-center">
          <Text className="text-primary text-sm font-bold uppercase tracking-widest mb-2">
            Saman's Farm
          </Text>
          <Text className="text-textMain text-3xl font-bold text-center">
            Hello World!
          </Text>
          <Text className="text-slate-500 mt-2 text-center">
            Your offline-first management app is ready.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}