import COLORS from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Custom Tab Button Component
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
);

export default function TabLayout() {
  const insets=useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:COLORS.primary,
        headerTitleStyle:{
          color:COLORS.textPrimary,
          fontWeight: "800",
        },
        headerShadowVisible:false,
        tabBarStyle:{
          backgroundColor:COLORS.cardBackground,
          borderTopWidth:1,
          borderTopColor: COLORS.border,
          paddingTop:5,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarHideOnKeyboard:true,
        tabBarButton: (props) => <CustomTabButton {...props} />,
      }}
    >
        <Tabs.Screen name='home'
          options={{
            title:"Home",
            tabBarIcon: ({color, size, focused})=>(<Ionicons 
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />)
          }}
        />
        <Tabs.Screen name='booking'
          options={{
            title:"Booking",
            tabBarIcon: ({color, size, focused})=>(<Ionicons 
              name={focused ? "list" : "list-outline"}
              size={size}
              color={color}
            />)
          }}
        />
        <Tabs.Screen name='add'
          options={{
            title:"Add",
            tabBarIcon: ({color, size, focused})=>(
            <Ionicons 
              name={focused ? "add-circle" : "add-circle-outline"}
              size={28}
              color={color}
            />
          )
          }}
        />
        
        <Tabs.Screen name='notification'
          options={{
            title:"Notification",
            tabBarIcon: ({color, size, focused})=>(<Ionicons 
              name={focused ? "notifications" : "notifications-outline"}
              size={size}
              color={color}
            />)
          }}
        />
        <Tabs.Screen name='profile'
          options={{
            title:"Profile",
            tabBarIcon: ({color, size, focused})=>(<Ionicons 
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />)
          }}
        />
    </Tabs>
  )
}