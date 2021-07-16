import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import io from 'socket.io-client';
import Moment from 'moment';

export default class Bill extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sumUsage: 0.00,
            totalBill: 0.00,
            dataDateRange: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    renderRow = ({ item, index }) => {
        return (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccccc', borderBottomRightRadius: 40 }}>
                <Text>{Moment(item.time).utcOffset("+08:00").format('D MMMM YYYY, h:mm:ss a') + ' :  ' + item.usage + 'kWh'}</Text>
            </View>
        )
    }

    fetchData = async () => {
        this.setState({ isLoading: true })
        const socket = io.connect("http://192.168.0.147:3000/");
        socket.emit('getDate', this.props.route.params.passDateRange);
        socket.on("resultDate", (revResult) => {
            console.log(revResult);
            socket.disconnect();
            this.setState({
                dataDateRange: revResult.rows, 
                sumUsage: revResult.sumUsage,
                totalBill: revResult.totalBill,
                isLoading: false
            });
        });

    }

    render() {
            return (
                <View style={styles.page}>
                    <Text style={styles.text}>Total Usage = {this.state.sumUsage} kWh</Text>
                    <Text style={styles.text}>Bill = RM{this.state.totalBill}</Text>
                    <FlatList
                    data={this.state.dataDateRange}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderRow}
                    refreshing={this.state.isLoading}
                    onRefresh={this.fetchData}
                    showsVerticalScrollIndicator={false}
                    />
                </View>
            )
    }
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 25,
        paddingLeft: 30,
    },
    text: {
        fontSize: 18,
        paddingBottom: 10
    },
})