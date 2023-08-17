import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Button, RingProgress, Text, Chip, Radio, Table } from '@mantine/core';
import * as XLSX from 'xlsx';
import prismColors from '../constant';
import { Link } from "react-router-dom";

function Hero(props) {

    const [selected, setSelected] = useState([]);
    // const [presentDays, setPresentDays] = useState([]);
    // const [absentDays, setAbsentDays] = useState([]);
    // const [selectedOption, setSelectedOption] = useState(null);
    const [attendanceData, setAttendanceData] = useState({}); // Use an object to store attendance data
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [holidayCount, setHolidayCount] = useState(0);
    // const [loading, setLoading] = useState(false);

    const handleSelect = (date) => {
        const isSelected = selected.some((s) => dayjs(date).isSame(s, 'date'));
        setSelected((current) => {
            const updatedSelected = isSelected
                ? current.filter((d) => !dayjs(d).isSame(date, 'date'))
                : [...current, date];

            // Update attendance data when a date is deselected
            if (attendanceData[date]) {
                const updatedAttendanceData = { ...attendanceData };
                delete updatedAttendanceData[date];
                setAttendanceData(updatedAttendanceData);
            }

            return updatedSelected;
        });

    };

    useEffect(() => {
        console.log(attendanceData)
        countAttendance();
    }, [attendanceData])

    const handleAttendanceChange = (userId, date, status) => {
        setAttendanceData(prevData => ({
            ...prevData,
            [date]: {
                ...(prevData[date] || {}),
                [userId]: status
            }
        }));
    };

    // const handleExport = async (data) => {
    //     const wb = XLSX.utils.book_new();
    //     const attendanceDataArray = await Object.keys(data).map((dateKey, idx) => {
    //         const date = dateKey;
    //         const attendanceValue = data[dateKey][idx];
    //         return {
    //             Date: date,
    //             Attendance: attendanceValue,
    //         };
    //     });

    //     const ws = XLSX.utils.json_to_sheet(attendanceDataArray);
    //     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

    //     XLSX.writeFile(wb, 'attendance.xlsx');
    // };


    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const attendanceDataArray = Object.keys(attendanceData).map((dateKey, idx) => {
            const date = dateKey;
            const parts = date.split(', ');
    
            const dayOfWeek = parts[0];
            const myDate = parts[1];
            const attendanceValue = attendanceData[dateKey][idx]; // Assuming '0' is the user ID
            return {
                myDate,
                dayOfWeek,
                attendanceValue,
            };
        });
        attendanceDataArray.map(function (obj) {
     
            // Assign new key
            obj['Date'] = obj['myDate'];
            obj['Week'] = obj['dayOfWeek'];
            obj['Attendance'] = obj['attendanceValue'];
            // Delete old key
            delete obj['myDate'];
            delete obj['attendanceValue'];
            delete obj['dayOfWeek'];
            return obj;
        });
        console.log(attendanceDataArray); // Add this line before creating the worksheet

        const ws = XLSX.utils.json_to_sheet(attendanceDataArray);
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
        XLSX.writeFile(wb, 'attendance.xlsx');
    };
    




const ClearAttendanc=()=>{
    setAttendanceData({})
    setSelected([])
}

    const countAttendance = () => {
        let pc = 0;
        let ac = 0;
        let hc = 0;
        Object.values(attendanceData).forEach(attendanceObj => {
            Object.values(attendanceObj).forEach(attendance => {
                if (attendance === 'present') {
                    pc++;
                } else if (attendance === 'absent') {
                    ac++;
                } else if (attendance === 'holiday') {
                    hc++;
                }
            });
        });
        setPresentCount(pc);
        setAbsentCount(ac);
        setHolidayCount(hc);
    };


    const rows = selected.map((dateString, index) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        return (
            <tr key={formattedDate} >

                <td style={{ fontSize: "15px" }}>
                    {formattedDate}
                </td>
                <td className='d-flex justift-content-center align-items-center'>
                    <Radio
                        className='m-0 mx-2 p-0'
                        type="radio"
                        name={`attendance_${index}`}
                        value="present"
                        checked={attendanceData[formattedDate]?.[index] === 'present'}
                        onChange={() => handleAttendanceChange(index, formattedDate, 'present')}
                    />
                    Present

                    <Radio
                        className='m-0 mx-2 p-0'
                        type="radio"
                        name={`attendance_${index}`}
                        value="absent"
                        checked={attendanceData[formattedDate]?.[index] === 'absent'}
                        onChange={() => handleAttendanceChange(index, formattedDate, 'absent')}
                    />
                    Absent

                    <Radio
                        className='m-0 mx-2 p-0'
                        type="radio"
                        name={`attendance_${index}`}
                        value="holiday"
                        checked={attendanceData[formattedDate]?.[index] === 'holiday'}
                        onChange={() => handleAttendanceChange(index, formattedDate, 'holiday')}
                    />
                    Holiday
                </td>

            </tr>
        );
    })

    return (
        <div className='container' style={{ height: "100vh" }}>
            <div className='d-flex justify-content-between align-items-start'>
                <div position="center">
                    <Calendar
                        style={{ color: "white", background: prismColors.comment }}
                        getDayProps={(date) => ({
                            selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
                            onClick: () => handleSelect(date),
                        })}
                    />
                    <Group position="center">
                        <RingProgress
                            size={170}
                            thickness={16}
                            label={
                                <Text size="xs" align="center" px="xs" sx={{ pointerEvents: 'none' }}>
                                    Hover to see information
                                </Text>
                            }
                            sections={[
                                { value: (presentCount / 30) * 100, color: 'cyan', tooltip: `Present-${presentCount}` },
                                { value: (absentCount / 30) * 100, color: 'orange', tooltip: `Absent-${absentCount}` },
                                { value: (holidayCount / 30) * 100, color: 'grape', tooltip: `Holiday-${holidayCount}` },
                            ]}
                        />
                    </Group>
                </div>


                <div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Chip className='mx-2' color="violet" variant="filled" checked>Total days : {selected?.length}</Chip>
                        <Chip className='mx-2' color="lime" variant="filled" checked>total present: {presentCount}</Chip>
                        <Chip className='mx-2' color="red" variant="filled" checked>total absent: {absentCount}</Chip>
                        <Chip className='mx-2' variant="filled" checked>total holiday: {holidayCount}</Chip>
                        <Button variant="outline" className='mx-2' onClick={async () => handleExport(attendanceData)}>
                            Download
                        </Button>
                        <Button variant="outline" className='mx-2' onClick={async () => ClearAttendanc()}>
                            Clear 
                        </Button>
                        <Link to="/AMS/how-to-use">
                            <Button variant="outline"  >
                                How to use
                            </Button>
                        </Link>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mt-2 mb-4'>
                        <Table withBorder className='text-center text-white' style={{ background: prismColors.comment }} >
                            <thead >
                                <tr>
                                    <th className='text-center'>Date</th>
                                    <th className='text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>{rows}</tbody>
                        </Table>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Hero;

