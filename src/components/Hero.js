import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Button } from '@mantine/core';
import * as XLSX from 'xlsx';

function Hero(props) {

    const [selected, setSelected] = useState([]);
    const [presentDays, setPresentDays] = useState([]);
    const [absentDays, setAbsentDays] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [attendanceData, setAttendanceData] = useState({}); // Use an object to store attendance data

    const handleSelect = (date) => {
        const isSelected = selected.some((s) => dayjs(date).isSame(s, 'date'));
        if (isSelected) {
            setSelected((current) => current.filter((d) => !dayjs(d).isSame(date, 'date')));
        } else {
            setSelected((current) => [...current, date]);
            // console.log(selected)
        }
    };

    // const handleExport = () => {
    //     const wb = XLSX.utils.book_new();
    //     const ws = XLSX.utils.json_to_sheet(selected.map(dateString => ({ Date: new Date(dateString).toLocaleDateString() })));

    //     XLSX.utils.book_append_sheet(wb, ws, 'Dates');

    //     XLSX.writeFile(wb, 'dates.xlsx');
    // };




    const userList = [
        { id: 1, name: 'User A' },
        { id: 2, name: 'User B' },
        { id: 3, name: 'User C' },
        // ... Add more users
    ];

    const handleAttendanceChange = (userId, date, status) => {
        // Update attendance data
        setAttendanceData(prevData => ({
            ...prevData,
            [date]: {
                ...(prevData[date] || {}),
                [userId]: status
            }
        }));

    };

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const attendanceDataArray = Object.keys(attendanceData).map((dateKey, idx) => {
            const date = dateKey;
            const attendanceValue = attendanceData[dateKey][idx]; // Assuming '0' is the user ID
            return {
                Date: date,
                Attendance: attendanceValue,
            };
        });

        const ws = XLSX.utils.json_to_sheet(attendanceDataArray);
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

        XLSX.writeFile(wb, 'attendance.xlsx');
    };



    return (
        <div>
            <div>
                <Group position="center">
                    <Calendar
                        getDayProps={(date) => ({
                            selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
                            onClick: () => handleSelect(date),
                        })}
                    />
                </Group>
            </div>

            <div>
                <p>Total days : {selected?.length}</p>
                Present All Days<input type="radio" />
                Absent All days<input type="radio" />
                {
                    selected.map((dateString, index) => {
                        const date = new Date(dateString);
                        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
                        const formattedDate = date.toLocaleDateString(undefined, options);
                        return (
                            <>
                                <p key={index}>
                                    {formattedDate}
                                    <label>
                                        <input
                                            type="radio"
                                            name={`attendance_${index}`}
                                            value="present"
                                            checked={attendanceData[formattedDate]?.[index] === 'present'}
                                            onChange={() => handleAttendanceChange(index, formattedDate, 'present')}
                                        />
                                        Present
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`attendance_${index}`}
                                            value="absent"
                                            checked={attendanceData[formattedDate]?.[index] === 'absent'}
                                            onChange={() => handleAttendanceChange(index, formattedDate, 'absent')}
                                        />
                                        Absent
                                    </label>
                                </p>
                            </>
                        );
                    })

                }
            </div>
            <div>
                <Button onClick={handleExport}>
                    Download
                </Button>
            </div>
        </div>
    );
}

export default Hero;

