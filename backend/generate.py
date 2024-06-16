import json
import os
import sys
from diffusers import StableDiffusionPipeline
import torch
from backgroundremover.bg import remove
from PIL import Image

def remove_bg(src_img_path, out_img_path):
    model_choices = ["u2net", "u2net_human_seg", "u2netp"]
    with open(src_img_path, "rb") as f:
        data = f.read()
    img = remove(data, model_name=model_choices[2],
                 alpha_matting=True,
                 alpha_matting_foreground_threshold=240,
                 alpha_matting_background_threshold=10,
                 alpha_matting_erode_structure_size=10,
                 alpha_matting_base_size=1000)
    with open(out_img_path, "wb") as f:
        f.write(img)

def add_to_background(foreground_path, output_path, x_size, y_size, background_color=(0, 0, 255, 255)):
    foreground = Image.open(foreground_path).convert("RGBA")
    background = Image.new('RGBA', (x_size, y_size), background_color)
    fg_w, fg_h = foreground.size
    position = (x_size - fg_w, y_size - fg_h)
    background.paste(foreground, position, foreground)
    background.save(output_path, format="PNG")

def process_images(config):
    x_size = config["sizeX"]
    y_size = config["sizeY"]
    gender = config["user"]["gender"]
    product_type = config["format"]

    genders = ["male", "female"]
    result_types = ["pkzn", "pk", "ak", "tk"]

    prompts = [
        "gazprom style, a house with a car, white background, concept art",
        "gazprom style, a house with flowers, blue background, (((concept art)))",
        "gazprom style, house with the palm tree, white background, concept art",
        "gazprom style, flowers with coins, white background, concept art",
        "gazprom style, a car with coins, white background, concept art",
        "gazprom style, a car with flowers, white background, concept art",
        "gazprom style, a bag of coins, white background, (((concept art)))",
        "gazprom style, coins with a bow, white background, concept art"
    ]

    prompt = None
    for i in range(2):
        if genders[i] == gender:
            for j in range(4):
                if result_types[j] == product_type:
                    prompt = prompts[j * 2 + i]
                    break

    if not prompt:
        raise ValueError("No valid prompt found for the given gender and product type.")

    pipeline = StableDiffusionPipeline.from_single_file("./weights/gazprom.ckpt")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    pipeline = pipeline.to(torch.float16)
    pipeline = pipeline.to(device)
    pipeline.enable_xformers_memory_efficient_attention()
    pipeline.safety_checker = lambda images, **kwargs: (images, [False] * len(images))
    num_images_per_prompt = 3

    negative_prompt = 'snow, ugly, disfigured, deformed'

    with torch.no_grad():
        images = pipeline(prompt, negative_prompt=negative_prompt, width=512, height=512, num_images_per_prompt=num_images_per_prompt, num_inference_steps=25).images

    output_model_dir = "./output_model"
    output_remover_dir = "./output_remover"
    output_final_dir = "./output_final"
    
    if not os.path.exists(output_model_dir):
        os.makedirs(output_model_dir)
    if not os.path.exists(output_remover_dir):
        os.makedirs(output_remover_dir)
    if not os.path.exists(output_final_dir):
        os.makedirs(output_final_dir)

    final_image_paths = []
    for i, image in enumerate(images):
        model_output_path = os.path.join(output_model_dir, "image_{}.png".format(i + 1))
        image.save(model_output_path)
        source_output = os.path.join(output_remover_dir, "image_{}.png".format(i + 1))
        remove_bg(model_output_path, source_output)
        background_output = os.path.join(output_final_dir, "image_{}.png".format(i + 1))
        add_to_background(source_output, background_output, x_size, y_size)
        final_image_paths.append(background_output)

    return final_image_paths

if __name__ == "__main__":
    config_path = sys.argv[1] if len(sys.argv) > 1 else "config.json"
    with open(config_path, 'r') as f:
        config = json.load(f)
    final_image_paths = process_images(config)
    for path in final_image_paths:
        print(path)

