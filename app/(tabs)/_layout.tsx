import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppTheme } from '@/constants/theme'

// Custom Tab Button Component (unchanged)
const CustomTabButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  </TouchableOpacity>
)

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppTheme.colors.primary,
        headerTitleStyle: {
          color: AppTheme.colors.gray800,
          fontWeight: "800",
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: AppTheme.colors.white,
          borderTopWidth: 1,
          borderTopColor: AppTheme.colors.gray200,
          paddingTop: 5,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => <CustomTabButton {...props} />,
      }}
    >
      <Tabs.Screen 
        name='home'
        options={{
          title: "Home",
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons 
              name={focused ? "compass" : "compass-outline"}  // More premium than home
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='booking'
        options={{
          title: "Bookings",
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"}  // More appropriate for bookings
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='add'
        options={{
          title: "Add",
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons 
              name={focused ? "duplicate" : "duplicate-outline"}  // More elegant than add-circle
              size={28}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='notification'
        options={{
          title: "Alerts",
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons 
              name={focused ? "notifications-circle" : "notifications-circle-outline"}  // More distinctive
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons 
              name={focused ? "person-circle" : "person-circle-outline"}  // More complete look
              size={size}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  )
}