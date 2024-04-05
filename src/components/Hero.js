import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import { Checkbox, Group } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { Button, RingProgress, Text, Chip, Radio, Table } from "@mantine/core";
import * as XLSX from "xlsx";
import prismColors from "../constant";
import { Link } from "react-router-dom";
import { Badge } from "@mantine/core";
import { Menu } from "@mantine/core";
import {
  IconInfoCircle,
  IconClick,
  IconDownload,
  IconTrash,
} from "@tabler/icons-react";
import "../App.css";
import CustomRadioButton from "../utils/CustomRadioButton";
import CustomRingGraph from "../utils/CustomRingGraph";

function Hero(props) {
  const [selected, setSelected] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); // object to store attendance data
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [holidayCount, setHolidayCount] = useState(0);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(attendanceData)
    countAttendance();
  }, [attendanceData]);

  const handleSelect = (date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));
    setSelected((current) => {
      const updatedSelected = isSelected
        ? current.filter((d) => !dayjs(d).isSame(date, "date"))
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

  const handleSelectAll = () => {
    const currentDate = dayjs(); // Get the current date
    const firstDayOfMonth = currentDate.startOf("month");
    const lastDayOfMonth = currentDate.endOf("month");

    const selectedDates = [];
    let currentDatePointer = firstDayOfMonth;

    while (
      currentDatePointer.isBefore(lastDayOfMonth) ||
      currentDatePointer.isSame(lastDayOfMonth, "day")
    ) {
      selectedDates.push(currentDatePointer.toDate());
      currentDatePointer = currentDatePointer.add(1, "day");
    }

    setSelected(selectedDates);
  };

  const handleAttendanceChange = (userId, date, status) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [date]: {
        ...(prevData[date] || {}),
        [userId]: status,
      },
    }));
  };

  const handleExport = () => {
    if (attendanceData?.length === 0) {
      alert("No data");
      return;
    }

    const wb = XLSX.utils.book_new();
    const attendanceDataArray = Object.keys(attendanceData).map(
      (dateKey, idx) => {
        const date = dateKey;
        const parts = date.split(", ");

        const dayOfWeek = parts[0];
        const myDate = parts[1];
        const attendanceValue = attendanceData[dateKey][idx]; // Assuming '0' is the user ID
        return {
          myDate,
          dayOfWeek,
          attendanceValue,
        };
      }
    );
    attendanceDataArray.map(function (obj) {
      // Assign new key
      obj["Date"] = obj["myDate"];
      obj["Day"] = obj["dayOfWeek"];
      obj["Attendance"] = obj["attendanceValue"];
      // Delete old key
      delete obj["myDate"];
      delete obj["attendanceValue"];
      delete obj["dayOfWeek"];
      return obj;
    });
    // console.log(attendanceDataArray); // Add this line before creating the worksheet

    const ws = XLSX.utils.json_to_sheet(attendanceDataArray);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    XLSX.writeFile(wb, "attendance.xlsx");
  };

  const handleSelectAllPresent = () => {
    const updatedAttendanceData = { ...attendanceData };

    selected.forEach((dateString, index) => {
      const formattedDate = dayjs(dateString).format("dddd, M/D/YYYY"); // Format the date
      const dateObj = updatedAttendanceData[formattedDate] || {};
      dateObj[index] = "present"; // Set 'present' status for the user
      updatedAttendanceData[formattedDate] = dateObj;
    });

    setAttendanceData(updatedAttendanceData);
  };

  const handleSelectAllAbsent = () => {
    const updatedAttendanceData = { ...attendanceData };

    selected.forEach((dateString, index) => {
      const formattedDate = dayjs(dateString).format("dddd, M/D/YYYY"); // Format the date
      const dateObj = updatedAttendanceData[formattedDate] || {};
      dateObj[index] = "absent"; // Set 'present' status for the user
      updatedAttendanceData[formattedDate] = dateObj;
    });

    setAttendanceData(updatedAttendanceData);
  };

  const handleSelectAllHoliday = () => {
    const updatedAttendanceData = { ...attendanceData };

    selected.forEach((dateString, index) => {
      const formattedDate = dayjs(dateString).format("dddd, M/D/YYYY"); // Format the date
      const dateObj = updatedAttendanceData[formattedDate] || {};
      dateObj[index] = "holiday"; // Set 'present' status for the user
      updatedAttendanceData[formattedDate] = dateObj;
    });

    setAttendanceData(updatedAttendanceData);
  };

  // const handleSelectAllPresent = () => {
  //     const updatedAttendanceData = { ...attendanceData };
  //     selected.forEach((dateString) => {
  //         const formattedDate = dayjs(dateString).format('YYYY-MM-DD');
  //         if (!updatedAttendanceData[formattedDate]) {
  //             updatedAttendanceData[formattedDate] = {};
  //         }
  //         updatedAttendanceData[formattedDate] = 'present'; // Set 'present' status for the date
  //     });

  //     setAttendanceData(updatedAttendanceData);
  // };

  const ClearAttendanc = () => {
    setAttendanceData({});
    setSelected([]);
  };

  const countAttendance = () => {
    let pc = 0;
    let ac = 0;
    let hc = 0;
    Object.values(attendanceData).forEach((attendanceObj) => {
      Object.values(attendanceObj).forEach((attendance) => {
        if (attendance === "present") {
          pc++;
        } else if (attendance === "absent") {
          ac++;
        } else if (attendance === "holiday") {
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
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return (
      <tr key={formattedDate}>
        <td style={{ fontSize: "15px" }}>{formattedDate}</td>
        <td className="d-flex justift-content-center align-items-center">
          <Radio
            id="present"
            className="m-0 mx-2 p-0"
            type="radio"
            name={`attendance_${index}`}
            value="present"
            checked={attendanceData[formattedDate]?.[index] === "present"}
            onChange={() =>
              handleAttendanceChange(index, formattedDate, "present")
            }
          />
          Present
          <Radio
            className="m-0 mx-2 p-0"
            type="radio"
            name={`attendance_${index}`}
            value="absent"
            checked={attendanceData[formattedDate]?.[index] === "absent"}
            onChange={() =>
              handleAttendanceChange(index, formattedDate, "absent")
            }
          />
          Absent
          <Radio
            className="m-0 mx-2 p-0"
            type="radio"
            name={`attendance_${index}`}
            value="holiday"
            checked={attendanceData[formattedDate]?.[index] === "holiday"}
            onChange={() =>
              handleAttendanceChange(index, formattedDate, "holiday")
            }
          />
          Holiday
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-end align-items-center mb-2 flex-wrap">
            <Chip className="mx-2" color="violet" variant="filled" checked>
              Days {selected?.length}
            </Chip>
            <Chip className="mx-2" color="lime" variant="filled" checked>
              Present {presentCount}
            </Chip>
            <Chip className="mx-2" color="red" variant="filled" checked>
              Absent {absentCount}
            </Chip>
            <Chip className="mx-2" variant="filled" checked>
              Holiday {holidayCount}
            </Chip>
            <Menu shadow="md" width={250} classNames="mt-2">
              <Menu.Target>
                <Button variant="outline" className="mx-2" radius="sm">
                  Action
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Click on below options</Menu.Label>

                <Menu.Item
                  icon={<IconClick size={14} />}
                  onClick={async () => handleSelectAll()}
                >
                  Mark Full Month Attendance
                </Menu.Item>
                <Menu.Item
                  icon={<IconTrash size={14} />}
                  onClick={async () => ClearAttendanc()}
                >
                  Clear Attendance
                </Menu.Item>
                <Menu.Item
                  icon={<IconDownload size={14} />}
                  onClick={async () => handleExport(attendanceData)}
                >
                  Download
                </Menu.Item>
                <Link
                  to="/AMS/how-to-use"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <Menu.Item icon={<IconInfoCircle size={14} />}>
                    How to use
                  </Menu.Item>
                </Link>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div position="center">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <Calendar
                style={{ color: "white", background: prismColors.comment }}
                getDayProps={(date) => ({
                  selected: selected.some((s) => dayjs(date).isSame(s, "date")),
                  onClick: () => handleSelect(date),
                })}
              />
            </div>

            <CustomRingGraph btnText="anas" />
            <Group position="center">
              {/* <RingProgress
                size={170}
                thickness={16}
                label={
                  <Text
                    size="xs"
                    align="center"
                    px="xs"
                    sx={{ pointerEvents: "none" }}
                  >
                    Hover to see information
                  </Text>
                }
                sections={[
                  {
                    value: (presentCount / 30) * 100,
                    color: "cyan",
                    tooltip: `Present-${presentCount}`,
                  },
                  {
                    value: (absentCount / 30) * 100,
                    color: "orange",
                    tooltip: `Absent-${absentCount}`,
                  },
                  {
                    value: (holidayCount / 30) * 100,
                    color: "grape",
                    tooltip: `Holiday-${holidayCount}`,
                  },
                ]}
              /> */}
            </Group>
          </div>
        </div>

        <div className="col-md-9">
          <div
            className="d-flex justify-content-around align-items-center"
            style={{ background: prismColors.comment }}
          >
            <CustomRadioButton
              name="selectAll"
              id="allPresent"
              onClick={() => handleSelectAllPresent()}
              btnText="Select All Present"
            />

            <CustomRadioButton
              htmlFor="allAbsent"
              name="selectAll"
              id="allAbsent"
              onClick={async () => handleSelectAllAbsent()}
              className="mx-1"
              btnText="Select All Absent"
            />

            <CustomRadioButton
              htmlFor="allHoliday"
              name="selectAll"
              id="allHoliday"
              onClick={async () => handleSelectAllHoliday()}
              className="mx-1"
              btnText="Select All Holiday"
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Table
              withBorder
              className="text-center text-white p-4 table-responsive"
              style={{ background: prismColors.comment }}
            >
              <thead>
                <tr>
                  <th className="text-center">Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">{rows}</tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
