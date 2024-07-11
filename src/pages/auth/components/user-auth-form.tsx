import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { useToast } from "@/components/ui/use-toast"

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor, insira seu Email' })
    .email({ message: 'Endereço de email inválido' }),
  password: z
    .string()
    .min(1, {
      message: 'Por favor, insira sua Senha',
    })
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)

    axios({
      method: 'post',
      url: 'http://localhost:3000/auth/signin',
      data: {
        email: data.email,
        password: data.password
      }
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        toast({
          variant: "destructive",
          title: "Ops, Algo deu errado!",
          description: "Não foi possível fazer login, revise seus dados e tente novamente.",
        })
      })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='nome@exemplo.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Senha</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2'>
              Entrar
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>

                </span>
              </div>
            </div>

          </div>
        </form>
      </Form>
    </div>
  )
}
