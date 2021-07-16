import React, { Component } from 'react';
import { StyleSheet, Button, View, Text, FlatList } from 'react-native';
import Moment from 'moment';
import io from 'socket.io-client';
import Header from '../component/header';

export default class Homescreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({isLoading: true})
        //const socket = io.connect("http://testnode.my.to:3000/");
        const socket = io.connect("http://192.168.0.147:3000/");
        socket.emit("getRows");
        socket.on("resultRows", (revResult) => {
            var resultRows = revResult;
            console.log(resultRows);
            this.setState({
                data: resultRows,
                isLoading: false
            });
          });
    }

    renderRow = ({ item, index }) => {
        Moment.locale('en');
        return (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccccc' }}>
                <Text>{Moment(item.time).utcOffset("+08:00").format('D MMMM YYYY, h:mm:ss a') + ' :  ' + item.usage + 'kWh'}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.content}>
                    <View style={styles.list}>
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderRow}
                            refreshing={this.state.isLoading}
                            onRefresh={this.fetchData}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    <Text style={{textAlign: 'center', marginBottom: 20}}>Swipe down to refresh</Text>
                    <Button
                        title="Calculate Bill"
                        onPress={() => this.props.navigation.navigate('Calculate Bill')}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        justifyContent: 'center',
        padding: 25
    },
    list: {
        justifyContent: 'center',
        textAlign: 'center',
        padding: 20
    },
    icon: {
        paddingLeft: 20
    },
})