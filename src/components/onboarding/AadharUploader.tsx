"use client"
import { cn } from '@/lib/utils'
import { useAadhaarImages } from '@/store/index'
import { Trash, File, ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { AadhaarFileDropzone } from './AadhaarFileDropzone'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from '../ui/form'
import { Zoom } from '../zoom-image'
import React from 'react'
import { FileWithPreview } from '@/types'
import { FileDialog } from '../file-dialog'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { FBOnboardingSchema } from '@/schema/onboarding.schema'
import { Button } from '../ui/button'

export const AadharUploader = ({ }) => {
	const { images, removeImage, } = useAadhaarImages();

	const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
	const { control, register, setValue, formState } = useFormContext<z.infer<typeof FBOnboardingSchema>>();




	return (
		<div className='flex flex-col md:grid grid-cols-2 gap-4'>
			<FormField
				control={control}
				name="primaryID.name"
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
				{files?.length ? (
					<div className="flex items-center gap-2">
						{files.map((file, i) => (
							<Zoom key={i}>
								<Image
									src={file.preview}
									alt={file.name}
									className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
									width={80}
									height={80}
								/>
							</Zoom>
						))}
					</div>
				) : null}
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

					/>
				</FormControl>
				<UncontrolledFormMessage
					message={formState.errors.alternativeIDFile?.message}
				/>
			</FormItem>
			<AadhaarFileDropzone />

		</div>
	);
};