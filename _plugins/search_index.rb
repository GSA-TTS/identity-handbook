Jekyll::Hooks.register :site, :post_write do |page|
  system("npm run index")
end
