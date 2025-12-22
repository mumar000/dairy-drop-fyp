import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "./Button"
import { Section } from "./Section"
import { useState } from "react"

export const Addresses = () => {
    const [addresses, setAddresses] = useState([
        { id: 1, text: '221B Baker Street, London', default: true },
        { id: 2, text: '742 Evergreen Terrace, USA', default: false },
    ])

    return (
        <Section
            title='Saved Addresses'
            desc='Manage delivery locations'
            action={
                <Button variant='secondary'>
                    <Plus size={16} />
                    Add Address
                </Button>
            }
        >
            <div className='space-y-4'>
                {addresses.map((a) => (
                    <div
                        key={a.id}
                        className='flex justify-between items-center border rounded-xl p-4'
                    >
                        <div>
                            <p className='font-medium'>{a.text}</p>
                            {a.default && (
                                <span className='text-xs text-green-600'>
                                    Default
                                </span>
                            )}
                        </div>

                        <div className='flex gap-2'>
                            <Button variant='secondary'>
                                <Pencil size={14} />
                            </Button>
                            <Button
                                variant='danger'
                                onClick={() =>
                                    setAddresses(
                                        addresses.filter((i) => i.id !== a.id)
                                    )
                                }
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    )
}