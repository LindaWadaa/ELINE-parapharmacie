import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(productId))
          .single();

        if (error) throw error;

        if (!cancelled) {
          setProduct(data);
        }
      } catch {
        if (!cancelled) {
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => { cancelled = true; };
  }, [productId]);

  return { product, loading };
}

export default useProduct;
