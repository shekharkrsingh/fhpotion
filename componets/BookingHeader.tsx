// import { View, Text } from 'react-native'
// import React, { useState } from 'react'
// import styles from '@/assets/styles/booking.styles'
// import { TextInput } from 'react-native-gesture-handler'


// interface BookingListHeaderProps {
//     toggleModal: () => void;
//     onSearch: (query: string) => void; 
// }


// const BookingHeader: React.FC<BookingListHeaderProps> = ({ toggleModal, onSearch }) => {

//     const [searchQuery, setSearchQuery] = useState('');

//     const handleSearchChange = (text: string) => {
//         setSearchQuery(text);
//         onSearch(text);
//     };

//   return (
//     <View style={styles.boookingHeader}>
//         <Text style={styles.title}>Booking List</Text>
//         <View style={styles.searchContainer}>
//             <TextInput 
//                 style={styles.searchInput}
//                 placeholder='Search...'
//                 value={searchQuery}
//                 onChangeText={handleSearchChange}
//                 />
//         </View>
//     </View>
//   )
// }

// export default BookingHeader