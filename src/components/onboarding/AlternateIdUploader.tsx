import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DOCUMENT_OPTIONS } from '@/constants/index'
import { cn } from '@/lib/utils'
import { FBOnboardingSchema } from '@/schema/onboarding.schema'
import { FileWithPreview } from '@/types'
import { Check, ChevronsUpDown, File as FileIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { FileDialog } from '../file-dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from '../ui/form'
import { Zoom } from '../zoom-image'


interface AlternateIdUploaderProps {
  files: FileWithPreview[] | null
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
}

export function AlternateIdUploader({ files, setFiles }: AlternateIdUploaderProps) {
  const [open, setOpen] = useState(false);

  const { control, setValue, formState, clearErrors } = useFormContext<z.infer<typeof FBOnboardingSchema>>();
  return (
    <div className='flex flex-col md:grid grid-cols-2 gap-4'>
      <FormField
        control={control}
        name="alternativeID.IDname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alternate ID</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-11", !field.value && "text-muted-foreground")}>
                      {field.value ? field.value : "Select a Alternate ID"}
                      <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command className="m-0 h-full w-full p-0">
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No Alternate Id found.</CommandEmpty>
                      <CommandGroup heading="Alternate ID">
                        {DOCUMENT_OPTIONS.map((doc_name, idx) => (
                          <CommandItem
                            key={doc_name + idx}
                            value={doc_name}
                            className="capitalize my-2 cursor-pointer"
                            onSelect={() => {
                              setValue("alternativeID.IDname", doc_name);
                              clearErrors("alternativeID.IDname");
                              setOpen(false);
                            }}>
                            {doc_name}
                            <Check className={cn("ml-auto h-4 w-4", doc_name === field.value ? "opacity-100" : "opacity-0")} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormItem className="flex w-full flex-col gap-1.5  justify-end">
        <FormLabel>Upload Alternate ID</FormLabel>
        <FormControl>
          <FileDialog
            setValue={setValue}
            name="alternativeID.files"
            maxFiles={3}
            maxSize={1024 * 1024 * 4}
            files={files}
            setFiles={setFiles}
            accept={{
              "application/pdf": [],
              "image/*": []
            }}
            labelText='Upload Alternate Id'
          />
        </FormControl>
        <UncontrolledFormMessage
          message={formState.errors.alternativeID?.files?.message}
        />
      </FormItem>

      {files?.length ? (
        <div className="flex items-center gap-2">
          {files.map((file, i) => (
            <React.Fragment key={i}>
              {
                !file.type.startsWith("image") ?
                  <div className='border border-gray-200 px-4 py-2 h-full rounded-md grid gap-2 place-items-center'>
                    <FileIcon className='h-7 w-7 text-blue-500 m-2' />
                  </div> :
                  <Zoom >
                    <Image
                      src={file.preview}
                      alt={file.name}
                      className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                      width={80}
                      height={80}
                    />
                  </Zoom>
              }
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  )
}

