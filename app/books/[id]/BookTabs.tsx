"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BookTabs({ info }: { info: any }) {
  const tabs = ["Özet", "Yazarlar", "Detaylar"];

  return (
    <Tab.Group>
      <Tab.List className="flex w-full rounded-xl p-1">
        {tabs.map((tab) => (
            <Tab
            key={tab}
            className={({ selected }) =>
                classNames(
                "w-full py-2.5 px-6 text-lg font-medium text-white text-center border-b-2 border-transparent cursor-pointer",
                selected ? "border-b-indigo-600" : "text-gray-400 hover:bg-gray-700/20"
                )
            }
            >
            {tab}
            </Tab>
        ))}
        </Tab.List>

      <Tab.Panels className="mt-4">
        <Tab.Panel>
          <div
            dangerouslySetInnerHTML={{ __html: info.description || "Açıklama yok." }}
          />
        </Tab.Panel>
        <Tab.Panel>
          <p>{info.authors?.join(", ") || "Yazar bilgisi yok."}</p>
          
          <p className=" opacity-0 pointer-events-none">
            <div
              dangerouslySetInnerHTML={{ __html: info.description || "Açıklama yok." }}
            />
          </p>
        </Tab.Panel>
        <Tab.Panel>
          <p>Yayınevi: {info.publisher || "Bilinmiyor"}</p>
          <p>Basım tarihi: {info.publishedDate || "N/A"}</p>
          <p>Sayfa sayısı: {info.pageCount || "?"}</p>
          <p>Kategori: {info.categories?.join(", ") || "Bilinmiyor"}</p>
          
          <p className=" opacity-0 pointer-events-none">
            <div
              dangerouslySetInnerHTML={{ __html: info.description || "Açıklama yok." }}
            />
          </p>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
