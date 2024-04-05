import React from 'react'
import { Button, RingProgress, Text, Chip, Radio, Table } from "@mantine/core";

const CustomRingGraph = ({ btnText }) => {
    return (
        <RingProgress
            size={170}
            thickness={16}
            label={
                <Text
                    size="xs"
                    align="center"
                    px="xs"
                    sx={{ pointerEvents: "none" }}
                >
                    {btnText}
                </Text>
            }
            sections={[
                {
                    value: (500 / 30) * 100,
                    color: "cyan",
                    tooltip: `Present-${500}`,
                },
                {
                    value: (500 / 30) * 100,
                    color: "orange",
                    tooltip: `Absent-${500}`,
                },
                {
                    value: (500 / 30) * 100,
                    color: "grape",
                    tooltip: `Holiday-${500}`,
                },
            ]}
        />
    )
}

export default CustomRingGraph