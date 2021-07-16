import React, { Component } from 'react';
import { StyleSheet, Button, View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Month from '../calendar/Month';
import moment from 'moment';

export default class calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: props.startDate && moment(props.startDate, 'YYYYMMDD'),
      untilDate: props.untilDate && moment(props.untilDate, 'YYYYMMDD'),
      availableDates: props.availableDates || null
    }
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onReset = this.onReset.bind(this);
    this.handleConfirmDate = this.handleConfirmDate.bind(this);
    this.handleRenderRow = this.handleRenderRow.bind(this);
  }

  static defaultProps = {
    initialMonth: '',
    dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    maxMonth: 12,
    buttonColor: 'green',
    buttonContainerStyle: {},
    showReset: true,
    ignoreMinDate: false,
    isHistorical: false,
    onSelect: () => { },
    onConfirm: () => { },
    placeHolderStart: 'Start Date',
    placeHolderUntil: 'Until Date',
    selectedBackgroundColor: 'green',
    selectedTextColor: 'white',
    todayColor: 'green',
    startDate: '',
    untilDate: '',
    minDate: '',
    maxDate: '',
    infoText: '',
    infoStyle: { color: '#fff', fontSize: 13 },
    infoContainerStyle: { marginRight: 20, paddingHorizontal: 20, paddingVertical: 5, backgroundColor: 'green', borderRadius: 20, alignSelf: 'flex-end' },
    showSelectionInfo: true,
    showButton: true,
  };


  static propTypes = {
    initialMonth: PropTypes.string,
    dayHeadings: PropTypes.arrayOf(PropTypes.string),
    availableDates: PropTypes.arrayOf(PropTypes.string),
    maxMonth: PropTypes.number,
    buttonColor: PropTypes.string,
    buttonContainerStyle: PropTypes.object,
    startDate: PropTypes.string,
    untilDate: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    showReset: PropTypes.bool,
    ignoreMinDate: PropTypes.bool,
    isHistorical: PropTypes.bool,
    onSelect: PropTypes.func,
    onConfirm: PropTypes.func,
    placeHolderStart: PropTypes.string,
    placeHolderUntil: PropTypes.string,
    selectedBackgroundColor: PropTypes.string,
    selectedTextColor: PropTypes.string,
    todayColor: PropTypes.string,
    infoText: PropTypes.string,
    infoStyle: PropTypes.object,
    infoContainerStyle: PropTypes.object,
    showSelectionInfo: PropTypes.bool,
    showButton: PropTypes.bool,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ availablcomponenteDates: nextProps.availableDates });
  }

  onSelectDate(date) {
    let startDate = null;
    let untilDate = null;
    const { availableDates } = this.state;

    if (this.state.startDate && !this.state.untilDate) {
      if (date.format('YYYYMMDD') < this.state.startDate.format('YYYYMMDD') || this.isInvalidRange(date)) {
        startDate = date;
      }
      else if (date.format('YYYYMMDD') > this.state.startDate.format('YYYYMMDD')) {
        startDate = this.state.startDate;
        untilDate = date;
      }
      else {
        startDate = null;
        untilDate = null;
      }
    }
    else if (!this.isInvalidRange(date)) {
      startDate = date;
    }
    else {
      startDate = null;
      untilDate = null;
    }

    this.setState({ startDate, untilDate });
    this.props.onSelect(startDate, untilDate);
  }

  isInvalidRange(date) {
    const { startDate, untilDate, availableDates } = this.state;

    if (availableDates && availableDates.length > 0) {
      //select endDate condition
      if (startDate && !untilDate) {
        for (let i = startDate.format('YYYYMMDD'); i <= date.format('YYYYMMDD'); i = moment(i, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD')) {
          if (availableDates.indexOf(i) == -1 && startDate.format('YYYYMMDD') != i)
            return true;
        }
      }
      //select startDate condition
      else if (availableDates.indexOf(date.format('YYYYMMDD')) == -1)
        return true;
    }

    return false;
  }

  getMonthStack() {
    let res = [];
    const { maxMonth, initialMonth, isHistorical } = this.props;
    let initMonth = moment().subtract(11, 'months').format('YYYYMM');

    if (initialMonth && initialMonth != '')
      initMonth = moment(initialMonth, 'YYYYMM');

    for (let i = 0; i < 12; i++) {
      res.push(
        !isHistorical ? (
          moment(initMonth).add(i, 'month').format('YYYYMM')
          //initMonth.clone().add(i, 'month').format('YYYYMM')
        ) : (
            initMonth.clone().subtract(i, 'month').format('YYYYMM')
          )
      );
    }

    return res;
  }

  onReset() {
    this.setState({
      startDate: null,
      untilDate: null,
    });

    this.props.onSelect(null, null);
  }

  handleConfirmDate() {
    this.props.onConfirm && this.props.onConfirm(this.state.startDate, this.state.untilDate);
    var dateRange = [this.state.startDate.format('yyyy-MM-DD'), this.state.untilDate.format('yyyy-MM-DD')];
    this.props.navigation.navigate('TotalBill', { passDateRange: dateRange });
  }

  handleRenderRow(month, index) {
    const { selectedBackgroundColor, selectedTextColor, todayColor, ignoreMinDate, minDate, maxDate } = this.props;
    let { availableDates, startDate, untilDate } = this.state;

    if (availableDates && availableDates.length > 0) {
      availableDates = availableDates.filter(function (d) {
        if (d.indexOf(month) >= 0)
          return true;
      });
    }

    return (
      <Month
        onSelectDate={this.onSelectDate}
        startDate={startDate}
        untilDate={untilDate}
        availableDates={availableDates}
        minDate={minDate ? moment(minDate, 'YYYYMMDD') : minDate}
        maxDate={maxDate ? moment(maxDate, 'YYYYMMDD') : maxDate}
        ignoreMinDate={ignoreMinDate}
        dayProps={{ selectedBackgroundColor, selectedTextColor, todayColor }}
        month={month} />
    )
  }


  render() {
    return (
      <View style={{ backgroundColor: '#fff', zIndex: 1000, alignSelf: 'center', width: '100%', flex: 1 }}>
        {
          this.props.showReset ?
            (<View style={{ flexDirection: 'row', justifyContent: "flex-end", padding: 20, paddingBottom: 10 }}>
              {
                this.props.showReset && <Text style={{ fontSize: 25 }} onPress={this.onReset}>Reset</Text>
              }
            </View>)
            :
            null
        }
        {
          this.props.showSelectionInfo ?
            (
              <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 5, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 34, color: '#666' }}>
                    {this.state.startDate ? moment(this.state.startDate).format("MMM DD YYYY") : this.props.placeHolderStart}
                  </Text>
                </View>

                <View style={{}}>
                  <Text style={{ fontSize: 80 }}>
                    /
								</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 34, color: '#666', textAlign: 'right' }}>
                    {this.state.untilDate ? moment(this.state.untilDate).format("MMM DD YYYY") : this.props.placeHolderUntil}
                  </Text>
                </View>
              </View>
            ) : null
        }

        {
          this.props.infoText != "" &&
          <View style={this.props.infoContainerStyle}>
            <Text style={this.props.infoStyle}>{this.props.infoText}</Text>
          </View>
        }
        <View style={styles.dayHeader}>
          {
            this.props.dayHeadings.map((day, i) => {
              return (<Text style={{ width: "14.28%", textAlign: 'center' }} key={i}>{day}</Text>)
            })
          }
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={this.getMonthStack()}
          renderItem={({ item, index }) => {
            return this.handleRenderRow(item, index)
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({ length: 362.65, offset: 362.65 * index, index })}
          initialScrollIndex={11}
        />

        {
          this.props.showButton ?
            (
              <View style={[styles.buttonWrapper, this.props.buttonContainerStyle]}>
                <Button
                  title="Select Date"
                  onPress={this.handleConfirmDate}
                  color={this.props.buttonColor} />
              </View>
            ) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  dayHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'stretch'
  },
})