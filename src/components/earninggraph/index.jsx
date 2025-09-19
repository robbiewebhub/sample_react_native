import React, { useState } from 'react';
import { View } from 'react-native';
import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryScatter,
} from 'victory-native';
import { Text as SvgText, TSpan } from 'react-native-svg';
import { COLORS, FONTS } from '../../constant';

const chartData = [
  { day: 'Thu', date: 'Apr 04', earnings: 10, orders: 2 },
  { day: 'Fri', date: 'Apr 04', earnings: 30, orders: 3 },
  { day: 'Sat', date: 'Apr 04', earnings: 20, orders: 4 },
  { day: 'Sun', date: 'Apr 04', earnings: 8, orders: 2 },
  { day: 'Mon', date: 'Apr 04', earnings: 4, orders: 1 },
  { day: 'Tue', date: 'Apr 04', earnings: 8, orders: 2 },
  { day: 'Wed', date: 'Apr 04', earnings: 18, orders: 3 },
];

const CustomTooltip = (props) => {
  const { datum, x, y, index, selectedBar, data } = props;
  console.log('graph', props);


  if (index !== selectedBar) return null;

  const deltaX = {
    '0': [8,12,15],
    [data.length-1]: [ -70,-68,-60]
  }

  return (
    <VictoryTooltip
      {...props}
      constrainToVisibleArea
      renderInPortal={true}
      flyoutStyle={{ fill: COLORS.neutral['black'], stroke: COLORS.neutral['black'] }}
      pointerLength={6}
      cornerRadius={6}
      flyoutPadding={{ top: 25, bottom: 50, left: 65, right: 65 }}
      active
      labelComponent={
        <SvgText fill={COLORS.common.white} fontSize={12} fontFamily={FONTS.poppins[400]}>
          <TSpan dx={ deltaX[index]?.[0] || -48} x={x} dy={-6}>{datum.orders}{'       '}orders</TSpan>
          <TSpan dx={deltaX[index]?.[1] || -45} x={x} dy={25} fontSize={16}>$ {datum.earnings}{'        '}earnings</TSpan>
          <TSpan dx={deltaX[index]?.[2] || -40} x={x} dy={20}>{datum.day}{'  ,    '}{datum.date}</TSpan>
        </SvgText>
      }
    />
  );
};

const EarningGraph = () => {
  const [selectedBar, setSelectedBar] = useState(null);

  const handleBarPress = (index) => {
    setSelectedBar(index === selectedBar ? null : index);
  };
  return (
    <View style={{ minHeight: 280 }}>
      <VictoryChart padding={{ top: 110, bottom: 25, left: 10, right: 50 }}>
        {/* Bar Chart */}
        <VictoryBar
          data={chartData}
          x="day"
          y="earnings"
          style={{
            data: { fill: COLORS.primary[50], width: 21 },
          }}
          labels={({ datum }) => datum.orders}
          labelComponent={<CustomTooltip selectedBar={selectedBar} />}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPress: (evt, clickedProps) => {
                  console.log(clickedProps, 'here');

                  handleBarPress(clickedProps.index);
                },
              },
            },
          ]}
        />

        {/* Line Chart */}
        <VictoryLine
          data={chartData}
          x="day"
          y="earnings"
          style={{
            data: { stroke: COLORS.primary[300], strokeWidth: 2 },
          }}
        />

        {/* Scatter Points */}
        <VictoryScatter
          data={chartData}
          x="day"
          y="earnings"
          size={({ index }) => (index === selectedBar ? 6 : 4)}
          style={{
            data: {
              fill: ({ index }) =>
                index === selectedBar
                  ? COLORS.common.white
                  : COLORS.primary[300],
              stroke: COLORS.primary[300],
              strokeWidth: ({ index }) => index === selectedBar ? 4 : 2,
            },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fill: COLORS.grey[200], fontSize: 12, fontFamily: FONTS.poppins[400] },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default EarningGraph;
