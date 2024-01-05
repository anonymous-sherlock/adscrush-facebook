"use client"
import { cn } from '@/lib/utils'
import { FBOnboardingSchema } from '@/schema/onboarding.schema'
import { FileWithPreview } from '@/types'
import { ChevronsUpDown, File as FileIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { FileDialog } from '../file-dialog'
import { Button } from '../ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from '../ui/form'
import { Zoom } from '../zoom-image'

interface AadhaarUploaderProps {
  files: FileWithPreview[] | null
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
}

export const AadharUploader = ({ files, setFiles }: AadhaarUploaderProps) => {

  const { control, register, setValue, formState } = useFormContext<z.infer<typeof FBOnboardingSchema>>();


  return (
    <div className='flex flex-col md:grid grid-cols-2 gap-4'>
      <FormField
        control={control}
        name="primaryID.IDname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-card-foreground">Primary ID</FormLabel>
            <FormControl>
              <FormControl>
                <Button variant="outline" role="combobox" disabled className={cn("w-full justify-between h-11", !field.value && "text-muted-foreground")}>
                  {field.value ? field.value : "Aadhar Card"}
                  <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </FormControl>

            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem className="flex w-full flex-col gap-1.5  justify-end">
        <FormLabel>Upload Aadhaar ID</FormLabel>

        <FormControl>
          <FileDialog
            setValue={setValue}
            name="primaryID.files"
            maxFiles={3}
            maxSize={1024 * 1024 * 4}
            files={files}
            setFiles={setFiles}
            accept={{
              "application/pdf": [],
              "image/*": []
            }}
            labelText='Upload Aadhaar Id'
          />
        </FormControl>
        <UncontrolledFormMessage
          message={formState.errors.primaryID?.files?.message}
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
                  <Zoom key={i}>
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
  );
};