import { MoreOutlined } from "@ant-design/icons";
import {
  convertSeconds,
  getPushTriggerEventName,
} from "../../shared/helpers/pushEditorHelpers";
import {
  useDeletePushMutation,
  useDuplicatePushMutation,
  useEditPushMutation,
  useGetPushesQuery,
  useTestPushMutation,
} from "@store/apis/pushApi";
import { Button, message, Spin, Table } from "antd";
import { useNavigate } from "react-router-dom";
import MonsterDropdown from "@shared/elements/Dropdown/Dropdown";
import { FaStopCircle } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoDuplicate } from "react-icons/io5";
import { GrTest } from "react-icons/gr";

const PushDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetPushesQuery();
  const [editPush, { isLoading: editPushIsLoading }] = useEditPushMutation();
  const [duplicatePush, { isLoading: duplicatePushIsLoading }] =
    useDuplicatePushMutation();
  const [deletePush, { isLoading: deletePushIsLoading }] =
    useDeletePushMutation();
  const [sendTestPush, { isLoading: sendTestPushIsLoading }] =
    useTestPushMutation();

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
    },
    {
      title: "Задержка",
      dataIndex: "delay",
      key: "delay",
      align: "center" as const,
    },
    {
      title: "Событие",
      dataIndex: "triggerEvent",
      key: "triggerEvent",
      align: "center" as const,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      align: "center" as const,
    },
  ];

  const showSpinner =
    isLoading ||
    editPushIsLoading ||
    deletePushIsLoading ||
    duplicatePushIsLoading ||
    sendTestPushIsLoading;

  const dataSource = data
    ?.filter(
      (push) => !push.recordedSchedules || push.recordedSchedules.length === 0
    )
    .map((push) => ({
      key: push._id,
      name: push.systemName,
      delay: convertSeconds(push.delay) ?? "Без задержки",
      triggerEvent: getPushTriggerEventName(push.triggerEvent),
      status: push.active ? (
        <span className="text-green-500">Активен</span>
      ) : (
        <span className="text-red-500">Остановлен</span>
      ),
      actions: (
        <div className="flex items-center justify-center gap-2">
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
            icon={<GrTest style={{ color: "white", fontSize: "15px" }} />}
          ></Button>
          <Button
            onClick={() => navigate(`/edit-push/${push._id}`)}
            type="text"
            className="bg-[#161724] hover:!bg-[#515ACA] text-white"
            icon={<MdModeEdit style={{ color: "white", fontSize: "15px" }} />}
          ></Button>
          <MonsterDropdown
            menu={{
              items: [
                {
                  key: "stop",
                  label: <span className="text-xs text-white">Остановить</span>,
                  onClick: () => {
                    editPush({
                      id: push._id!,
                      data: { active: false },
                    }).unwrap();
                  },
                  icon: (
                    <FaStopCircle
                      style={{ color: "white", fontSize: "15px" }}
                    />
                  ),
                },
                {
                  key: "duplicate",
                  label: (
                    <span className="text-xs text-white">Дублировать</span>
                  ),
                  onClick: () => {
                    duplicatePush(push._id!).unwrap();
                  },
                  icon: <IoDuplicate style={{ color: "white" }} />,
                },
                {
                  key: "delete",
                  label: <span className="text-xs text-red">Удалить</span>,
                  onClick: () => {
                    deletePush(push._id!).unwrap();
                  },
                  icon: <MdDelete />,
                  danger: true,
                },
              ],
            }}
          >
            <Button
              type="text"
              className="bg-[#161724] hover:!bg-[#515ACA] text-white"
              icon={
                <MoreOutlined style={{ color: "white", fontSize: "15px" }} />
              }
            />
          </MonsterDropdown>
        </div>
      ),
    }));

  return showSpinner ? (
    <Spin fullscreen />
  ) : (
    <div className="px-[50px] pt-[110px] pb-[40px]">
      <div className="flex justify-between items-center mb-7">
        <span className="text-xl font-bold leading-8 text-white">Мои пуши</span>
        <button
          onClick={() => navigate("/create-push")}
          className="bg-[#02E314] text-[#161724] flex items-center justify-center px-3 rounded box-border h-[42px] hover:opacity-80 hover:shadow-sm"
        >
          + Создать пуш
        </button>
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default PushDashboard;
