import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { getUserData, editUserData } from "@/apis/user";
import { UserIcon } from "@/components/icons";

// 定義 UserInfo 的型別，讓 avatar 支援 string | null
type UserInfo = {
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  exerciseFrequency: number;
  bmr: number;
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editInfo, setEditInfo] = useState<UserInfo | null>(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDataResponse = await getUserData();

        if (!userDataResponse || userDataResponse.status === 401) {
          console.log("Unauthorized, redirecting to login.");
          navigate("/login");
 
          return; 
        }

        setUserInfo(userDataResponse.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  // 驗證使用者名稱是否符合要求：只能包含中文或英文字符
  const validateName = (name: string) => {
    const regex = /^[a-zA-Z\u4e00-\u9fa5]+$/;

    return regex.test(name);
  };

  // 驗證 email 格式
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return regex.test(email);
  };

  // 處理輸入變更
  const handleInputChange = (field: keyof UserInfo, value: string | number) => {
    if (field === 'exerciseFrequency' && typeof value === 'string') {
      value = Number(value);
    }
    setEditInfo((prev) => {
      if (prev) {
        return {
          ...prev,
          [field]: value,
        };
      }

      return {
        name: "",
        email: "",
        age: 0,
        height: 0,
        weight: 0,
        exerciseFrequency: 0,
        bmr: 0,
      };
    });
  };

  // 保存變更
  const handleSave = async () => {
    if (editInfo) {
      // 檢查使用者名稱和 email 是否符合格式
      if (!validateName(editInfo.name)) {
        alert("使用者名稱只能包含中文或英文字符！");

        return;
      }
      if (!validateEmail(editInfo.email)) {
        alert("請輸入有效的 email 地址！");

        return;
      }

      try {
        const result = await editUserData({
          userName: editInfo.name,
          birthDate: new Date().toISOString(),
          height: editInfo.height,
          weight: editInfo.weight,
          gender: 1,
          exerciseFrequency: editInfo.exerciseFrequency,
        });
  
        if (result) {
          setUserInfo({ ...editInfo }); 
          setIsEditing(false); 
        } else {
          alert("更新資料失敗，請稍後再試。");
        }
      } catch (error) {
        console.error("更新資料錯誤:", error);
        alert("伺服器錯誤，請稍後再試。"); 
      }
    }
  };

  // 取消編輯
  const handleCancel = () => {
    setEditInfo({ ...userInfo! }); 
    setIsEditing(false); 
  };

  // 取得使用者資料
  const handleGetUserData = async () => {
    const { message, userData } = await getUserData();

    if (message === "成功取得使用者資料") {
      const userDataFetched: UserInfo = {
        name: userData.userID.userName,
        email: userData.userID.email,
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
        exerciseFrequency: userData.exerciseFrequency,
        bmr: userData.bmr,
      };

      setUserInfo(userDataFetched); 
      setEditInfo(userDataFetched); 
    }
  };

  useEffect(() => {
    handleGetUserData();
  }, []);

  if (!userInfo || !editInfo) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-gray-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
            {/* 用戶資訊 */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer relative group">
                <UserIcon />
              </div>
              {!isEditing ? (
                <>
                  <h2 className="text-lg font-semibold mt-4">{userInfo.name}</h2>
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                  <button
                    className="px-4 py-1 mt-2 bg-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-300"
                    onClick={() => setIsEditing(true)}
                  >
                    編輯資料
                  </button>
                </>
              ) : (
                <>
                  <input
                    className="mt-4 p-2 border rounded w-full"
                    value={editInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <input
                    className="mt-2 p-2 border rounded w-full"
                    value={editInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
                      onClick={handleSave}
                    >
                      儲存
                    </button>
                    <button
                      className="px-4 py-1 bg-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-300"
                      onClick={handleCancel}
                    >
                      取消
                    </button>
                  </div>
                </>
              )}
            </div>
            <hr className="border-gray-300 mb-6" />
            {/* 用戶詳細資訊 */}
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span>年齡</span>
                    <input
                      className="w-24 p-1 border rounded"
                      type="number"
                      value={editInfo.age}
                      onChange={(e) =>
                        handleInputChange("age", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>身高</span>
                    <input
                      className="w-24 p-1 border rounded"
                      type="number"
                      value={editInfo.height}
                      onChange={(e) =>
                        handleInputChange("height", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>體重</span>
                    <input
                      className="w-24 p-1 border rounded"
                      type="number"
                      value={editInfo.weight}
                      onChange={(e) =>
                        handleInputChange("weight", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>運動頻率</span>
                    <input
                      className="w-24 p-1 border rounded"
                      type="number"
                      value={editInfo.exerciseFrequency}
                      onChange={(e) =>
                        handleInputChange(
                          "exerciseFrequency",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span>年齡</span>
                    <span>{userInfo.age} 歲</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>身高</span>
                    <span>{userInfo.height} cm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>體重</span>
                    <span>{userInfo.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>運動頻率</span>
                    <span>{userInfo.exerciseFrequency} 天 / 每週</span>
                  </div>
                </>
              )}
            </div>
            <hr className="border-gray-300 mt-6 mb-4" />
            {/* BMR 計算結果 */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">預估 BMR</h3>
              <p className="text-4xl font-bold">{userInfo.bmr}</p>
            </div>
          </div>
        </section>
      </DefaultLayout>
    </div>
  );
}
