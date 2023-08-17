import React from 'react';
import { Link } from "react-router-dom";
import { Timeline, Text } from '@mantine/core';
import { IconCalendarBolt, IconClick, IconDownload, IconDiscountCheckFilled } from '@tabler/icons-react';
import { Button } from '@mantine/core';

function HowToUse(props) {
    return (
        <div className='container'>

            <div className='d-flex justify-content-between align-items-center my-2'>
                <h4 >How to use</h4>
                <Link to="/AMS">
                    <Button variant="outline">
                        Back To Home
                    </Button>
                </Link>
            </div>

            <Timeline active={5} bulletSize={30} lineWidth={5}>
                <Timeline.Item bullet={<IconCalendarBolt size={20} />}>
                    <Text color="lime" size="sm">Select the dates from Calendar on which you want to mark the Attendance.</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconClick size={20} />} lineVariant="dashed">
                    <Text color="lime" size="sm">Mark Your Attendance Status in the table according to date.</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconDownload size={20} />}>
                    <Text color="lime" size="sm">Now click on Download button.</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconDiscountCheckFilled size={20} />}>
                    <Text color="lime" size="sm">That&apos;s all.</Text>
                </Timeline.Item>
            </Timeline>
        </div>
    );
}

export default HowToUse;