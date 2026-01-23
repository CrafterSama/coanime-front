import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { createPostColumns } from '@/components/modules/posts/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/auth';
import { usePosts } from '@/hooks/posts';
import { postDelete } from '@/services/posts';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Posts = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [postId, setPostId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const {
    data = {},
    isLoading,
    refetch,
  } = usePosts({
    page,
    name,
  });
  const { data: posts = [], result } = data;
  const columns = React.useMemo(
    () => createPostColumns(user, setPostId, setOpenDeleteModal),
    [user, setPostId, setOpenDeleteModal]
  );

  useEffect(() => {
    if (router?.query?.page) {
      return setPage(Number(router?.query?.page));
    }
    return setPage(1);
  }, [router?.query?.page]);

  const onPageChange = async () => {
    await router.push({
      pathname: '/dashboard/posts',
      query: {
        page: page,
      },
    });
  };

  const deletePost = (id: string) => {
    setPostId(id);
    postDelete(id)
      .then(() => {
        toast.success('Post eliminado');
        refetch();
        onPageChange();
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        refetch();
        setOpenDeleteModal(false);
      });
  };

  useEffect(() => {
    onPageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Head>
        <title>Coanime.net - Lista de Articulos</title>
      </Head>
      <AppLayout>
        <Modal
          title="Borrar Post"
          isOpen={openDeleteModal}
          toggleModal={() => setOpenDeleteModal(!openDeleteModal)}>
          <div className="flex flex-col gap-8">
            <p>
              ¿Estas seguro de borrar este post? ¡Esta acción no se puede
              deshacer!
            </p>
            <div className="flex flex-row justify-end gap-4">
              <Button
                variant="link"
                onClick={() => setOpenDeleteModal(!openDeleteModal)}>
                No
              </Button>
              <Button
                suffix={<TrashIcon className="w-4 h-4" />}
                onClick={() => postId && deletePost(postId)}
                className="flex flex-row items-center gap-2">
                <span>Si</span>
              </Button>
            </div>
          </div>
        </Modal>
        <div className="p-4">
          <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-row gap-4 justify-between items-center mb-4">
              <div className="flex flex-row gap-4 items-center">
                <Link
                  href="/dashboard"
                  className="bg-gray-200 text-orange-400 rounded p-1 hover:bg-gray-300 transition-colors">
                  <ChevronLeftIcon className="w-6 h-6" />
                </Link>
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                  Lista de Articulos
                </h2>
              </div>
              <Link
                href={`/dashboard/posts/create`}
                className="font-semibold py-2 px-4 rounded-lg transition-colors text-orange-500 bg-orange-100 hover:bg-orange-200 shadow-sm hover:shadow-md flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Crear
              </Link>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
              {isLoading ? (
                <div className="flex justify-center content-center min-h-screen">
                  <Loading size={16} />
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={posts}
                  searchKey="title"
                  searchPlaceholder="Buscar por título..."
                  pagination={
                    result
                      ? {
                          pageIndex: (result.current_page ?? page) - 1,
                          pageSize: result.per_page ?? 15,
                          total: result.total ?? 0,
                          lastPage: result.last_page ?? 1,
                          currentPage: result.current_page ?? page,
                          onPageChange: (newPage: number) => {
                            setPage(newPage);
                          },
                        }
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Posts;
