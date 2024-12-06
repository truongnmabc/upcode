import { Drawer } from "@mui/material";

// import { db } from "@/lib/db/db.model";
// import { useEffect } from "react";

type IPros = {
  open: boolean;
  setOpen: (e: boolean) => void;
};
const ModalTest = ({ open, setOpen }: IPros) => {
  // async function getIndexedDBUsage() {
  //     if (!window.indexedDB) {
  //         console.log("Trình duyệt không hỗ trợ IndexedDB.");
  //         return;
  //     }

  //     let totalSize = 0;

  //     // Lấy danh sách cơ sở dữ liệu
  //     const databases = await window.indexedDB.databases();

  //     for (const dbInfo of databases) {
  //         const db = await new Promise((resolve, reject) => {
  //             const request = window.indexedDB.open(dbInfo.name);
  //             request.onsuccess = () => resolve(request.result);
  //             request.onerror = () => reject(request.error);
  //         });

  //         // Lặp qua các object store
  //         for (const storeName of db.objectStoreNames) {
  //             const transaction = db.transaction(storeName, "readonly");
  //             const store = transaction.objectStore(storeName);
  //             const request = store.getAll();

  //             const data = await new Promise((resolve, reject) => {
  //                 request.onsuccess = () => resolve(request.result);
  //                 request.onerror = () => reject(request.error);
  //             });

  //             // Tính toán kích thước dữ liệu
  //             const size = JSON.stringify(data).length;
  //             totalSize += size;
  //         }

  //         db.close();
  //     }

  //     console.log(
  //         `Dung lượng IndexedDB: ${(totalSize / 1024).toFixed(2)} KB`
  //     );
  // }

  // useEffect(() => {
  //     navigator.storage.estimate().then(({ usage, quota }) => {
  //         console.log(
  //             `Dung lượng đã sử dụng: ${(usage / 1024 / 1024).toFixed(2)} MB`
  //         );
  //         console.log(
  //             `Dung lượng tối đa: ${(quota / 1024 / 1024).toFixed(2)} MB`
  //         );
  //     });
  //     getIndexedDBUsage();
  // }, []);

  // useEffect(() => {
  //     const handleTets = async () => {
  //         const data = await db.topicQuestion
  //             .where("[subTopicTag+tag]")
  //             .equals(["machines", "machines-extended-3"])
  //             .first();

  //         const question = data?.questions?.map(
  //             (item) => item.answers.find((item) => item.correct)?.text
  //         );
  //         console.log("🚀 ~ handleTets ~ question:", question);
  //     };
  //     handleTets();
  // }, []);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      anchor="right"
    >
      <div className="w-[400px] bg-white p-3 h-full">ModalTest</div>
    </Drawer>
  );
};

export default ModalTest;
