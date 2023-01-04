import { FC } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { item } from "../FileViewer/FileItem/FileItem";

export interface DropdownItem {
  label: React.ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  children: React.ReactNode;
  itemGroups: DropdownItem[][];
}

const Dropdown: FC<DropdownProps> = ({ children, itemGroups }) => (
  <Menu as="div" className="relative inline-block text-left">
    <div>
      <Menu.Button className="inline-flex w-full justify-center rounded-xl bg-gray-200 dark:bg-neutral-900 bg-opacity-0 dark:bg-opacity-30 transition-all px-4 py-1.5 font-sans hover:bg-opacity-30 dark:hover:bg-opacity-90 outline-none">
        {children}
      </Menu.Button>
    </div>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-neutral-800 px-3 py-1 rounded-md bg-white dark:bg-neutral-900 shadow-xl shadow-black/5 ring-1 ring-black ring-opacity-5 focus:outline-none">
        {itemGroups.map((items, i) => (
          <div key={i} className="px-1 py-1">
            {items.map(({ label, onClick }, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <button
                    onClick={onClick}
                    className={`${
                      active ? "bg-gray-100 dark:bg-neutral-800" : ""
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm font-sans`}
                  >
                    {label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);

export default Dropdown;
