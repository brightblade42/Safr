/* This example requires Tailwind CSS v2.0+ */
import React,{ Fragment, useState } from 'react'
import { Listbox, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const people = [
    { id: 1, name: 'Wade Cooper' },
    { id: 2, name: 'Arlene Mccoy' },
    { id: 3, name: 'Devon Webb' },
    { id: 4, name: 'Tom Cook' },
    { id: 5, name: 'Tanya Fox' },
    { id: 6, name: 'Hellen Schmidt' },
    { id: 7, name: 'Caroline Schultz' },
    { id: 8, name: 'Mason Heaney' },
    { id: 9, name: 'Claudie Smitham' },
    { id: 10, name: 'Emil Schaefer' },
]

const statuses =[
    {
        "sttsId": 1,
        "description": "Active",
    },
    {
        "sttsId": 2,
        "description": "In-Active",
    },
    {
        "sttsId": 3,
        "description": "Suspended",
    },
    {
        "sttsId": 4,
        "description": "Pending",
    },
    {
        "sttsId": 5,
        "description": "Flagged",
    },
    {
        "sttsId": 6,
        "description": "Sex Offender",
    },
    {
        "sttsId": 7,
        "description": "Barred from Campus",
    },
    {
        "sttsId": 10,
        "description": "Health Status",
    },
    {
        "sttsId": 11,
        "description": "Terminated",
    },
    {
        "sttsId": 13,
        "description": "High Roller",
    },
    {
        "sttsId": 14,
        "description": "FR Watch",
    },
    {
        "sttsId": 15,
        "description": "Card Counter",
    },
    {
        "sttsId": 16,
        "description": "Test Status",
    }
]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SelectBox(props) {
    const [selected, setSelected] = useState(statuses[0]);
    const [direction, setDirection] = useState(1); //0 = down  1 = up

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    //this seems to be a bit of a hack. probably a better way to do this.
    //note: this only works because max height of box is max-h-60, otherwise 72 would push it to far up.
    function open_dir() {
        return direction === 0 ? "mt-1" : "-mt-72";
    }


    return (
        <Listbox value={selected} onChange={setSelected} >
            <div className="mt-1 relative w-full">

                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <span className="block">{selected.description}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                    </span>
                </Listbox.Button>

                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">

                    <Listbox.Options className={`absolute z-20 ${open_dir()} w-full bg-white shadow-lg max-h-60 rounded-md py-1
                                    text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm`}>
                        {statuses.map((status) => (
                            <Listbox.Option
                                key={status.sttsId}

                                className={({ active }) =>
                                    classNames(
                                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                    )
                                }

                                value={status} >

                                    {({ selected, active }) => (
                                        <>
                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block ')}>
                                          {status.description}
                                        </span>

                                        {
                                            selected ? (
                                                <span
                                                    className={classNames(
                                                          active ? 'text-white' : 'text-indigo-600',
                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                              </span>
                                          ) : null
                                        }
                                        </>
                                )}
                           </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}
