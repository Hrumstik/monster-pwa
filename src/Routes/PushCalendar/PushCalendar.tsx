import {
  useDeletePushMutation,
  useDuplicatePushMutation,
  useEditPushMutation,
  useGetPushesQuery,
  useTestPushMutation,
} from "@store/apis/pushApi";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Calendar, Tag, message, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { FaArrowLeft, FaStopCircle } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import CalendarIcon from "@icons/CalendarIcon";
import MonsterSelect from "@shared/elements/Select/MonsterSelect";
import PurpleButton from "@shared/elements/PurpleButton/PurpleButton";
import MonsterPopover from "@shared/elements/Popover/MonsterPopover";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { GrTest } from "react-icons/gr";
import { IoDuplicate } from "react-icons/io5";
import "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ru");

const PushCalendar = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetPushesQuery();
  const [editPush, { isLoading: editPushIsLoading }] = useEditPushMutation();
  const [duplicatePush, { isLoading: duplicatePushIsLoading }] =
    useDuplicatePushMutation();
  const [deletePush, { isLoading: deletePushIsLoading }] =
    useDeletePushMutation();
  const [sendTestPush, { isLoading: sendTestPushIsLoading }] =
    useTestPushMutation();

  const scheduledPushes = data?.filter((push) => push.recordedSchedules);

  const dateCellRender = (value: Dayjs) => {
    const pushes = scheduledPushes?.filter((push) =>
      push.recordedSchedules.some((schedule) =>
        dayjs(schedule).isSame(value, "day")
      )
    );

    if (!pushes?.length) {
      return (
        <div
          className="w-full h-full cursor-pointer"
          onClick={() =>
            navigate(`/schedule-push-create/${value.toISOString()}`)
          }
        />
      );
    }

    return (
      <ul className="flex flex-col gap-2.5">
        {pushes?.map((push) => (
          <li
            key={push.systemName}
            className="flex items-center justify-center"
          >
            <MonsterPopover
              content={
                <div className="flex gap-5">
                  <Tooltip title="Редактировать">
                    <Button
                      onClick={() => navigate(`/schedule-push/${push._id}`)}
                      type="text"
                      className="bg-[#161724] hover:!bg-[#515ACA] text-white"
                      icon={
                        <MdModeEdit
                          style={{ color: "white", fontSize: "15px" }}
                        />
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Клонировать">
                    <Button
                      type="text"
                      onClick={async () => {
                        await duplicatePush(push._id!).unwrap();
                      }}
                      className="bg-[#161724] hover:!bg-[#515ACA] text-white"
                      icon={
                        <IoDuplicate
                          style={{ color: "white", fontSize: "15px" }}
                        />
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Тестовый пуш">
                    <Button
                      type="text"
                      onClick={async () => {
                        try {
                          await sendTestPush({ id: push._id! }).unwrap();
                          message.success("Тестовый пуш отправлен");
                        } catch {
                          message.error("Ошибка при отправке тестового пуша");
                        }
                      }}
                      className="bg-[#161724] hover:!bg-[#515ACA] text-white"
                      icon={
                        <GrTest style={{ color: "white", fontSize: "15px" }} />
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Остановить">
                    <Button
                      type="text"
                      onClick={() =>
                        editPush({
                          id: push._id!,
                          data: { active: false },
                        }).unwrap()
                      }
                      className="bg-[#161724] hover:!bg-[#515ACA] text-white"
                      icon={
                        <FaStopCircle
                          style={{ color: "white", fontSize: "15px" }}
                        />
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <Button
                      type="text"
                      onClick={async () => {
                        await deletePush(push._id!).unwrap();
                      }}
                      className="bg-[#161724] hover:!bg-[#a8071a] text-white"
                      icon={
                        <MdDelete
                          style={{ color: "white", fontSize: "15px" }}
                        />
                      }
                    />
                  </Tooltip>
                </div>
              }
              placement="top"
              mouseLeaveDelay={0.4}
              trigger="hover"
            >
              <Tag
                onClick={() => navigate(`/schedule-push/${push._id}`)}
                color={push.color}
              >
                {push.systemName}{" "}
                {dayjs(push.recordedSchedules[0])
                  .tz(push.timeZone)
                  .format("HH:mm")}
              </Tag>
            </MonsterPopover>
          </li>
        ))}
      </ul>
    );
  };

  const showSpinner =
    isLoading ||
    editPushIsLoading ||
    deletePushIsLoading ||
    duplicatePushIsLoading ||
    sendTestPushIsLoading;

  return showSpinner ? (
    <Spin fullscreen />
  ) : (
    <div className="px-[50px] pt-[110px] pb-[40px]">
      <div className="flex justify-between items-center mb-7">
        <span className="text-xl font-bold leading-8 text-white">
          PUSH - по расписанию
        </span>
        <button
          onClick={() => navigate("/create-schedule-push/")}
          className="bg-[#02E314] text-[#161724] flex items-center justify-center px-3 rounded box-border h-[42px] hover:opacity-80 hover:shadow-sm"
        >
          + Создать пуш
        </button>
      </div>
      <Calendar
        cellRender={dateCellRender}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          return (
            <div className="flex justify-between h-[76px] items-center px-5 boder-">
              <MonsterSelect
                value={type}
                onChange={(value) => onTypeChange(value)}
                className="min-w-24"
                suffixIcon={<CalendarIcon />}
                options={[
                  { label: "Месяц", value: "month" },
                  { label: "Год", value: "year" },
                ]}
              />

              <div className="flex gap-2 items-center">
                <Button
                  shape="circle"
                  className="bg-transparent border-none hover:!bg-[#515ACA]"
                  icon={
                    <FaArrowLeft style={{ color: "white", fontSize: "15px" }} />
                  }
                  onClick={() => {
                    const now = value.clone().subtract(1, "month");
                    onChange(now);
                  }}
                />

                {
                  <div className="font-bold text-base text-white uppercase min-w-32 flex justify-center">
                    {value.format("MMMM YYYY")}
                  </div>
                }
                <Button
                  shape="circle"
                  className="bg-transparent border-none hover:!bg-[#515ACA]"
                  onClick={() => {
                    const now = value.clone().add(1, "month");
                    onChange(now);
                  }}
                  icon={
                    <FaArrowRight
                      style={{ color: "white", fontSize: "15px" }}
                    />
                  }
                />
              </div>
              <PurpleButton text="Сегодня" onClick={() => onChange(dayjs())} />
            </div>
          );
        }}
      />
    </div>
  );
};

export default PushCalendar;
