import os
import re
import json
import shutil

# Resolve workspace paths dynamically
# Typically, quocnv15.github.io is at bkplus/quocnv15.github.io
# SwiftUI_Temp is at manking/SwiftUI_Temp (which are siblings under 0-Working)
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
swiftui_temp_dir = os.path.abspath(os.path.join(current_dir, "..", "manking", "SwiftUI_Temp"))

# Fallbacks if paths are different (e.g. running on local machine under other schemes)
if not os.path.exists(swiftui_temp_dir):
    swiftui_temp_dir = "/Volumes/Workspace/0-Working/manking/SwiftUI_Temp"

github_io_dir = current_dir
dest_images_dir = os.path.join(github_io_dir, "assets", "images", "swiftui")
dest_data_dir = os.path.join(github_io_dir, "_data")

# Ensure target directories exist
os.makedirs(dest_images_dir, exist_ok=True)
os.makedirs(dest_data_dir, exist_ok=True)

# Category mapping to group they neatly
category_mapping = {
    # Text & Typography
    "Text & Typography": "Text & Typography",
    "Text & Animation": "Text & Typography",
    "Text Animation": "Text & Typography",
    
    # Animations & Loaders
    "Animations & Loaders": "Animations & Loaders",
    "UI Components & Animations": "Animations & Loaders",
    "Loading & Progress Indicators": "Animations & Loaders",
    "Animations & Effects": "Animations & Loaders",
    
    # Buttons & Interactive Elements
    "Buttons & Interactive Elements": "Buttons & Interaction",
    "Interactive Components": "Buttons & Interaction",
    "Toggles & Switches": "Buttons & Interaction",
    
    # Pickers & Selection
    "Pickers & Selection": "Pickers & Selection",
    
    # UI Components & Layouts
    "UI Components & Layouts": "UI & Layouts",
    "Navigation & Custom Views": "UI & Layouts",
    "Social Apps": "UI & Layouts",
    "Utility Apps": "UI & Layouts",
    "Productivity Apps": "UI & Layouts",
    
    # Cards & 3D Effects
    "Cards & 3D Effects": "Visual Effects & 3D",
    "Theme & Appearance": "Visual Effects & 3D",
    "Colors & Visual Effects": "Visual Effects & 3D",
    
    # Forms & Input
    "Forms & Input": "Forms & Inputs",
    
    # Progress & Indicators
    "Progress & Indicators": "Lists, Alerts & Progress",
    "Lists & Data Display": "Lists, Alerts & Progress",
    "Alerts & Dialogs": "Lists, Alerts & Progress",
    
    # Tutorials & Concepts
    "Tutorials & Concepts": "Concepts & Tutorials",
    "Advanced & Modifiers": "Concepts & Tutorials",
    
    # Premium Products
    "Premium Products": "Premium & Advanced",
    
    # Games & Media
    "Game & Entertainment": "Games & Media",
    "Games": "Games & Media",
    "Image Editing": "Games & Media",
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

def clean_markdown_link(text):
    match = re.match(r'\[([^\]]+)\]\(([^)]+)\)', text)
    if match:
        name = match.group(1).replace('**', '').replace('__', '').strip()
        url = match.group(2).strip()
        name = name.replace('✅', '').replace('✨', '').replace('🎨', '').replace('❤️', '').strip()
        return name, url
    
    text_clean = text.replace('**', '').replace('__', '').replace('✅', '').replace('✨', '').strip()
    return text_clean, None

def build_showcase():
    print(f"Scanning SwiftUI projects in: {swiftui_temp_dir}")
    print(f"Targeting Jekyll data in: {github_io_dir}")
    
    if not os.path.exists(swiftui_temp_dir):
        print(f"ERROR: SwiftUI_Temp directory not found at {swiftui_temp_dir}")
        return
        
    all_projects = []
    
    # Helper to parse a README file
    def parse_readme(readme_path, author_name, prefix_path=""):
        if not os.path.exists(readme_path):
            print(f"Warning: README not found at {readme_path}")
            return
            
        with open(readme_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        sections = re.split(r'\n###\s+', content)
        for section in sections[1:]:
            lines = section.strip().split('\n')
            category_name = lines[0].split('\n')[0].strip()
            
            # Skip non-category sections
            if category_name in [
                "Giới thiệu", "Công nghệ được sử dụng", "Cách sử dụng", 
                "Yêu cầu", "Đặc điểm nổi bật", "Collections", "License", 
                "Tác giả", "Danh sách dự án (105+ Projects)", "Danh sách dự án", "Nguồn"
            ]:
                continue
                
            for line in lines[1:]:
                line = line.strip()
                if line.startswith('|'):
                    if '---' in line or 'Preview' in line or 'Dự án' in line:
                        continue
                    parts = [p.strip() for p in line.split('|')[1:-1]]
                    if len(parts) >= 3:
                        preview_cell = parts[0]
                        project_cell = parts[1]
                        desc_cell = parts[2]
                        platform = parts[3] if len(parts) > 3 else "iOS"
                        
                        proj_name, proj_link = clean_markdown_link(project_cell)
                        if not proj_name:
                            continue
                            
                        # Resolve relative paths
                        rel_path = ""
                        if proj_link:
                            link_clean = proj_link.lstrip('./')
                            rel_path = os.path.join(prefix_path, link_clean) if prefix_path else link_clean
                            
                        # Extracted image from markdown
                        img_match = re.search(r'src=["\']([^"\']+)["\']', preview_cell)
                        if not img_match:
                            img_match = re.search(r'!\[[^\]]*\]\(([^)]+)\)', preview_cell)
                        img_path = img_match.group(1) if img_match else ""
                        if img_path.startswith('.'):
                            img_path = img_path.lstrip('./')
                        if prefix_path and img_path and not img_path.startswith(prefix_path):
                            img_path = os.path.join(prefix_path, img_path)
                            
                        all_projects.append({
                            "name": proj_name,
                            "relative_path": rel_path or os.path.join(prefix_path or "", proj_name.replace(" ", "_")),
                            "author": author_name,
                            "category": category_name,
                            "description": desc_cell,
                            "platform": platform,
                            "preview_image": img_path,
                            "has_source": bool(proj_link)
                        })

    # 1. Parse all 3 READMEs
    parse_readme(os.path.join(swiftui_temp_dir, "0_sucodee", "README.md"), "sucodee", "0_sucodee")
    parse_readme(os.path.join(swiftui_temp_dir, "0_Singh", "README.md"), "Shubham Singh", "0_Singh")
    parse_readme(os.path.join(swiftui_temp_dir, "README.md"), "Kavsoft / Other", "")
    
    print(f"Initially parsed {len(all_projects)} items from README tables.")
    
    # 2. Process images physically and consolidate categories
    consolidated_projects = []
    copied_images_count = 0
    
    for proj in all_projects:
        author = proj["author"]
        name = proj["name"]
        rel_path = proj["relative_path"]
        
        author_slug = slugify(author)
        proj_slug = slugify(name)
        
        proj_full_path = os.path.join(swiftui_temp_dir, rel_path)
        
        found_image = None
        
        # Heuristics to look for images in the filesystem if not specified or doesn't exist
        if proj["preview_image"]:
            path_candidate = os.path.join(swiftui_temp_dir, proj["preview_image"])
            if os.path.exists(path_candidate) and os.path.isfile(path_candidate):
                found_image = path_candidate
                
        if not found_image and os.path.exists(proj_full_path):
            # 1. Look in 'images' folder first
            images_dir = os.path.join(proj_full_path, "images")
            if os.path.exists(images_dir) and os.path.isdir(images_dir):
                for root, dirs, files in os.walk(images_dir):
                    for file in files:
                        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                            found_image = os.path.join(root, file)
                            break
                    if found_image:
                        break
                        
            # 2. Look in the root of the project
            if not found_image:
                for file in os.listdir(proj_full_path):
                    if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')) and os.path.isfile(os.path.join(proj_full_path, file)):
                        found_image = os.path.join(proj_full_path, file)
                        break
                        
            # 3. Look in any subdirectory except build, xcodeproj, git
            if not found_image:
                for root, dirs, files in os.walk(proj_full_path):
                    if ".git" in root or "__MACOSX" in root or ".xcodeproj" in root or "build" in root or "DerivedData" in root:
                        continue
                    for file in files:
                        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                            found_image = os.path.join(root, file)
                            break
                    if found_image:
                        break
                        
        copied_img_url = ""
        if found_image:
            ext = os.path.splitext(found_image)[1].lower()
            new_img_name = f"{author_slug}_{proj_slug}{ext}"
            dest_img_path = os.path.join(dest_images_dir, new_img_name)
            
            try:
                shutil.copy2(found_image, dest_img_path)
                copied_img_url = f"/assets/images/swiftui/{new_img_name}"
                copied_images_count += 1
            except Exception as e:
                print(f"Error copying {found_image} -> {dest_img_path}: {e}")
                
        # Consolidate category
        original_cat = proj["category"]
        consolidated_cat = category_mapping.get(original_cat, "Other")
        
        # Local workspace folder link (for open-in-Finder capability)
        local_link = f"file://{proj_full_path}"
        
        consolidated_projects.append({
            "name": name,
            "relative_path": rel_path,
            "author": author,
            "category": consolidated_cat,
            "original_category": original_cat,
            "description": proj["description"],
            "platform": proj["platform"],
            "preview_image": copied_img_url,
            "local_link": local_link,
            "has_source": proj["has_source"]
        })
        
    print(f"Total projects processed: {len(consolidated_projects)}")
    print(f"Copied {copied_images_count} preview images to {dest_images_dir}")
    
    # Save the output json file
    output_json_path = os.path.join(dest_data_dir, "swiftui_projects.json")
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(consolidated_projects, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully generated {output_json_path} ✅")

if __name__ == "__main__":
    build_showcase()
