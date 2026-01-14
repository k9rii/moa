import { useState, useEffect } from "react";
import { getOutfits, getOutfitsByCategory } from "../lib/outfits";
import CategoryFilter from "./CategoryFilter";
import { ItemCard } from "./ItemCard";

type Celebrity = {
  id: string;
  name: string;
  group_name?: string | null;
};

type Outfit = {
  id: string;
  created_at: string;
  image_url: string;
  description: string;
  celebrities?: Celebrity | Celebrity[] | null;
};

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  // 그룹 토글 상태 (key: groupName)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  // 멤버 토글 상태 (key: groupName-memberName) - 중복 방지 위해 조합 키 사용
  const [openMembers, setOpenMembers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let data;
        if (selectedFilter === "all" || selectedFilter === "group") {
          data = await getOutfits();
        } else {
          data = await getOutfitsByCategory(selectedFilter);
        }
        setOutfits(data || []);
      } catch (error) {
        console.error("Failed to fetch outfits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedFilter]);

  // --- [데이터 가공 로직] ---

  // 1. 그룹 이름 정규화 함수
  const normalizeGroupName = (name: string) =>
    name === "others" ? "OTHERS" : name.toUpperCase();

  // 2. 데이터 그룹화 및 정렬 (그룹 -> 멤버)
  const getSortedGroupData = () => {
    // 1단계: 그룹별로 묶기
    const grouped = outfits.reduce<Record<string, Outfit[]>>((acc, outfit) => {
      const celeb = Array.isArray(outfit.celebrities)
        ? outfit.celebrities[0]
        : outfit.celebrities;
      const groupName = celeb?.group_name ? celeb.group_name.trim() : "Others";
      const groupKey = groupName.toLowerCase(); // 소문자로 통일해서 키 관리

      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(outfit);
      return acc;
    }, {});

    // 2단계: 그룹 키를 ABC순으로 정렬
    const sortedGroupKeys = Object.keys(grouped).sort((a, b) =>
      a.localeCompare(b)
    );

    return sortedGroupKeys.map((groupKey) => {
      const groupItems = grouped[groupKey];

      // 3단계: 그룹 내부에서 멤버별로 다시 묶기
      const memberGrouped = groupItems.reduce<Record<string, Outfit[]>>(
        (mAcc, item) => {
          const celeb = Array.isArray(item.celebrities)
            ? item.celebrities[0]
            : item.celebrities;
          const memberName = celeb?.name ? celeb.name.trim() : "Unknown";

          if (!mAcc[memberName]) mAcc[memberName] = [];
          mAcc[memberName].push(item);
          return mAcc;
        },
        {}
      );

      // 4단계: 멤버 이름 ABC순 정렬
      const sortedMemberNames = Object.keys(memberGrouped).sort((a, b) =>
        a.localeCompare(b)
      );

      return {
        groupKey, // 소문자 키
        displayName: normalizeGroupName(groupKey), // 보여줄 대문자 이름
        members: sortedMemberNames.map((memberName) => ({
          name: memberName,
          items: memberGrouped[memberName],
        })),
      };
    });
  };

  const sortedData = getSortedGroupData();

  // --- [토글 핸들러] ---

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const toggleMember = (groupKey: string, memberName: string) => {
    const uniqueKey = `${groupKey}-${memberName}`;
    setOpenMembers((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  // ... imports 및 로직 동일 ...

  return (
    // [수정 1] min-h-screen 추가: 콘텐츠가 적어도 화면 전체 높이를 차지하도록 강제
    <div className="container mx-auto px-4 pb-20 min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-3 border-b border-gray-100 -mx-4 px-4 mb-4">
        <CategoryFilter
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
      </div>

      {loading ? (
        // [수정 2] 로딩 화면을 중앙에 예쁘게 배치 (flex-1 사용)
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
          <span>Loading...</span>
        </div>
      ) : outfits.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
          <span className="text-4xl">😅</span>
          <p className="text-gray-500 font-medium">
            There are no products registered yet.
          </p>
          <p className="text-xs text-gray-400">
            Please select a different category!
          </p>
        </div>
      ) : (
        <>
          {selectedFilter === "group" ? (
            <div className="space-y-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-normal">
                  * Groups and members are sorted alphabetically.
                </p>
              </div>

              {sortedData.map(({ groupKey, displayName, members }) => {
                const isGroupOpen = openGroups[groupKey] || false;

                return (
                  <section
                    key={groupKey}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <button
                      className={`w-full flex justify-between items-center px-4 py-4 text-left transition-colors ${
                        isGroupOpen ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => toggleGroup(groupKey)}
                    >
                      <span className="font-bold text-lg text-gray-800">
                        {displayName}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {isGroupOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isGroupOpen && (
                      <div className="bg-white px-2 pb-2">
                        {members.map((member) => {
                          const memberKey = `${groupKey}-${member.name}`;
                          const isMemberOpen = openMembers[memberKey] || false;

                          return (
                            <div key={member.name} className="mt-2 first:mt-0">
                              <button
                                onClick={() =>
                                  toggleMember(groupKey, member.name)
                                }
                                className="w-full flex justify-between items-center px-3 py-3 text-left hover:text-[#F26B83] rounded-md transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-400">
                                    ↳
                                  </span>
                                  <span className="font-medium text-gray-700">
                                    {member.name}
                                  </span>
                                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                    {member.items.length}
                                  </span>
                                </div>
                                <span className="text-gray-400 text-xs">
                                  {isMemberOpen ? "▲" : "▼"}
                                </span>
                              </button>

                              {isMemberOpen && (
                                <div className="px-2 pb-4 pt-1">
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                                    {member.items.map((outfit) => (
                                      <ItemCard
                                        key={outfit.id}
                                        outfit={outfit}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
              {outfits.map((outfit) => (
                <ItemCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
