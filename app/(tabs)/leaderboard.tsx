import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { handleLeaderBoard } from '../redux/user/userSlice'; 
import { RootState, AppDispatch } from '../redux/store';

const { height: screenHeight } = Dimensions.get('window');

const LeaderboardScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const leaderBoard = useSelector((state: RootState) => state.user.leaderBoard);
    const error = useSelector((state: RootState) => state.user.error);

    useEffect(() => {
        dispatch(handleLeaderBoard());
    }, [dispatch]);

    const getBackgroundColor = (rank: number) => {
        switch (rank) {
            case 1:
                return '#FFCA28'; // Gold for rank 1
            case 2:
                return '#CDCDCD'; // Silver for rank 2
            case 3:
                return '#FF8228'; // Bronze for rank 3
            default:
                return 'white'; // White for other ranks
        }
    };

    const renderItem = ({ item }: { item: { userId: string; userProfileImage: string; name: string | null; userPoints: number; rank: number; } }) => {
        const profileImage = item.userProfileImage ? { uri: item.userProfileImage } : require('../assets/default_profile.png');
        const displayName = item.name && item.name.trim() !== '' ? item.name : 'Anonymous';

        return (
            <View style={[styles.itemContainer, { backgroundColor: getBackgroundColor(item.rank) }]}>
                <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{item.rank}</Text>
                    <Image
                        source={profileImage}
                        style={styles.profileImage}
                        resizeMode='cover'
                    />
                    <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
                        {displayName}
                    </Text>
                    <Text style={styles.pointsText} numberOfLines={1} ellipsizeMode="tail">
                        {item.userPoints} points
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Leaderboard</Text>
                </View>
                {error && <Text style={styles.errorText}>Error: {error}</Text>}
                <FlatList
                    data={leaderBoard}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.userId}
                    contentContainerStyle={[styles.listContainer, { paddingBottom: screenHeight * 0.1 }]}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
    headerContainer: {
        height: 80,
        marginBottom: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FD9F10',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    itemContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 30,
        marginBottom: 20,
    },
    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    rankText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 15,
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 15,
    },
    nameText: {
        fontSize: 16,
        flex: 3,
        marginRight: 15,
    },
    pointsText: {
        fontSize: 14,
        flexShrink: 1,
        marginRight: 15,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
});
